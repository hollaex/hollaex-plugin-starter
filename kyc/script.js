'use strict';

const {
	installedLibraries,
	multer,
	meta,
	app,
	toolsLib,
	expressValidator,
	lodash,
	loggerPlugin,
	moment
} = this;

const aws = installedLibraries['aws-sdk'];
const PhoneNumber = installedLibraries['awesome-phonenumber'];
const upload = multer();

const VERIFY_STATUS = {
	EMPTY: 0,
	PENDING: 1,
	REJECTED: 2,
	COMPLETED: 3
};

const s3 = () => {
	aws.config.update({
		accessKeyId: meta.accessKeyId,
		secretAccessKey: meta.secretAccessKey
	});
	return new aws.S3({
		region: meta.region,
		signatureVersion: 'v4'
	});
};

const uploadFile = (name, file) => {
	return new Promise((resolve, reject) => {
		const params = {
			Bucket: meta.bucketName,
			Key: name,
			Body: file.buffer,
			ContentType: file.mimetype,
			ACL: 'authenticated-read'
		};
		s3().upload(params, (err, data) => {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

const getKeyFromLink = (link) => {
	const AWS_SE = 'amazonaws.com/';
	const indexOfService = link.indexOf(AWS_SE);
	if (indexOfService > 0) {
		return link.substring(indexOfService + AWS_SE.length);
	}
	// if not amazon.com link, return same link
	return link;
};

const getPublicLink = (privateLink) => {
	const params = {
		Bucket: meta.bucketName,
		Key: getKeyFromLink(privateLink),
		Expires: 300 //seconds
	};

	return s3().getSignedUrl('getObject', params);
};

const validMimeType = (type = '') => {
	return type.indexOf('image/') === 0;
};

const getType = (type = '') => {
	return type.replace('image/', '');
};

app.put('/plugins/kyc/user', [
	toolsLib.security.verifyBearerTokenExpressMiddleware(['user']),
	expressValidator.checkSchema({
		full_name: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			isLength: {
				errorMessage: 'must be minimum length of 1',
				options: { min: 1 }
			},
			optional: true
		},
		gender: {
			in: ['body'],
			errorMessage: 'must be a boolean',
			isBoolean: true,
			optional: true
		},
		nationality: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			isLength: {
				errorMessage: 'must be minimum length of 1',
				options: { min: 1 }
			},
			optional: true
		},
		dob: {
			in: ['body'],
			errorMessage: 'must be a string',
			isISO8601: true,
			optional: true
		},
		address: {
			in: ['body'],
			custom: {
				options: (value) => {
					if (!lodash.isPlainObject(value)) {
						return false;
					}
					if (!value.country || !lodash.isString(value.country)) {
						return false;
					}
					if (!value.address || !lodash.isString(value.address)) {
						return false;
					}
					if (!value.postal_code || !lodash.isString(value.postal_code)) {
						return false;
					}
					if (!value.country || !lodash.isString(value.country)) {
						return false;
					}
					return true;
				}
			},
			errorMessage: 'must be an object with country, address, postal_code, country (all string)',
			optional: true
		}
	})
], (req, res) => {
	const errors = expressValidator.validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	loggerPlugin.verbose(
		req.uuid,
		'PUT /plugins/kyc/user auth',
		req.auth.sub
	);

	const newData = req.body;
	const { email } = req.auth.sub;

	toolsLib.user.getUserByEmail(email, false)
		.then(async (user) => {
			if (!user) {
				throw new Error('User not found');
			}

			const updatedData = lodash.pick(newData, [
				'full_name',
				'gender',
				'dob',
				'address',
				'nationality'
			]);

			let updatedUser = await user.update(updatedData, {
				fields: [
					'full_name',
					'gender',
					'nationality',
					'dob',
					'address'
				],
				returning: true
			});

			updatedUser = lodash.omit(updatedUser.dataValues, [
				'password',
				'is_admin',
				'is_support',
				'is_kyc',
				'is_supervisor'
			]);

			return res.json(updatedUser);
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'PUT /plugins/kyc/user err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
});

app.put('/plugins/kyc/admin', [
	toolsLib.security.verifyBearerTokenExpressMiddleware(['admin', 'supervisor', 'support']),
	expressValidator.checkSchema({
		user_id: {
			in: ['query'],
			errorMessage: 'must be an integer',
			isInt: true,
			optional: false
		},
		full_name: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			isLength: {
				errorMessage: 'must be minimum length of 1',
				options: { min: 1 }
			},
			optional: true
		},
		gender: {
			in: ['body'],
			errorMessage: 'must be a boolean',
			isBoolean: true,
			optional: true
		},
		nationality: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			isLength: {
				errorMessage: 'must be minimum length of 1',
				options: { min: 1 }
			},
			optional: true
		},
		dob: {
			in: ['body'],
			errorMessage: 'must be a string',
			isISO8601: true,
			optional: true
		},
		address: {
			in: ['body'],
			custom: {
				options: (value) => {
					if (!lodash.isPlainObject(value)) {
						return false;
					}
					if (!value.country || !lodash.isString(value.country)) {
						return false;
					}
					if (!value.address || !lodash.isString(value.address)) {
						return false;
					}
					if (!value.postal_code || !lodash.isString(value.postal_code)) {
						return false;
					}
					if (!value.country || !lodash.isString(value.country)) {
						return false;
					}
					return true;
				}
			},
			errorMessage: 'must be an object with country, address, postal_code, country (all string)',
			optional: true
		},
		phone_number: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			isLength: {
				errorMessage: 'must be minimum length of 1',
				options: { min: 1 }
			},
			optional: true
		}
	})
], (req, res) => {
	const errors = expressValidator.validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	loggerPlugin.verbose(
		req.uuid,
		'PUT /plugins/kyc/admin auth',
		req.auth.sub
	);

	const ip = req.headers['x-real-ip'];
	const domain = req.headers['x-real-origin'];
	const admin_id = req.auth.sub.id;
	const id = req.query.user_id;
	const newData = req.body;

	toolsLib.user.getUserByKitId(id, false)
		.then((user) => {
			if (!user) {
				throw new Error('User not found');
			}

			const prevUserData = lodash.cloneDeep(user.dataValues);

			if (newData.phone_number) {
				const phoneNumber = new PhoneNumber(newData.phone_number);
				if (!phoneNumber.isValid()) {
					throw new Error('Invalid phone number given');
				}
				newData.phone_number = phoneNumber.getNumber();
			}

			const updatedData = lodash.pick(newData, [
				'full_name',
				'gender',
				'dob',
				'address',
				'nationality',
				'phone_number'
			]);

			return Promise.all([
				user.update(updatedData, {
					fields: [
						'full_name',
						'gender',
						'dob',
						'address',
						'nationality',
						'phone_number'
					],
					returning: true
				}),
				prevUserData
			]);
		})
		.then(async ([ user, prevUserData ]) => {
			await toolsLib.user.createAudit(admin_id, 'userUpdate', ip, {
				userId: user.id,
				prevUserData,
				newUserDate: user,
				domain
			});

			user = lodash.omit(user.dataValues, [
				'password',
				'is_admin',
				'is_support',
				'is_kyc',
				'is_supervisor'
			]);

			return res.json(user);
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'PUT /plugins/kyc/user err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
});

app.get('/plugins/kyc/admin/files', [
	toolsLib.security.verifyBearerTokenExpressMiddleware(['admin', 'supervisor', 'support', 'kyc']),
	expressValidator.checkSchema({
		user_id: {
			in: ['query'],
			errorMessage: 'must be an integer',
			isInt: true,
			optional: true
		},
		email: {
			in: ['query'],
			errorMessage: 'must be an email',
			isEmail: true,
			optional: true
		}
	})
], (req, res) => {
	const errors = expressValidator.validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	loggerPlugin.verbose(
		req.uuid,
		'GET /plugins/kyc/id auth',
		req.auth.sub
	);

	const { email, user_id } = req.query;
	const where = {};

	if (user_id) {
		where.id = user_id;
	} else if (email) {
		where.email = email;
	} else {
		loggerPlugin.error(req.uuid, 'GET /plugins/kyc/admin/files', 'Email or id required');
		return res.status(400).json({ message: 'Email or id required' });
	}

	toolsLib.database.findOne('user', { where, attributes: ['id', 'id_data' ], raw: true })
		.then((user) => {
			if (!user) {
				throw new Error('User not found');
			}

			return toolsLib.database.findOne('verification image', {
				where: { user_id: user.id },
				order: [['created_at', 'desc']],
				attributes: ['front', 'back', 'proof_of_residency'],
				raw: true
			});
		})
		.then((images) => {
			if (!images) {
				throw new Error('ID image not found');
			}
			const data = {
				front: images.front ? getPublicLink(images.front) : '',
				back: images.back ? getPublicLink(images.back) : '',
				proof_of_residency: images.proof_of_residency ? getPublicLink(images.proof_of_residency) : ''
			};

			return res.json(data);
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'GET /plugins/kyc/admin/files err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
});

app.post('/plugins/kyc/verify', [
	toolsLib.security.verifyBearerTokenExpressMiddleware(['admin', 'supervisor', 'support', 'kyc']),
	expressValidator.checkSchema({
		user_id: {
			in: ['body'],
			errorMessage: 'must be an integer',
			isInt: true,
			optional: false
		},
		message: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			isLength: {
				errorMessage: 'must be minimum length of 1',
				options: { min: 1 }
			},
			optional: true
		}
	})
], (req, res) => {
	const errors = expressValidator.validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	loggerPlugin.verbose(
		req.uuid,
		'POST /plugins/kyc/verify auth',
		req.auth.sub
	);

	const { user_id, message } = req.body;

	loggerPlugin.info(
		req.uuid,
		'POST /plugins/kyc/verify user_id',
		user_id
	);

	toolsLib.user.getUserByKitId(user_id, false)
		.then((user) => {
			if (!user) {
				throw new Error('User not found');
			}

			if (user.id_data.status === VERIFY_STATUS.COMPLETED) {
				throw new Error('ID already verified');
			}

			return user.update({
				id_data: { ...user.id_data, status: VERIFY_STATUS.COMPLETED, note: message }
			}, {
				fields: ['id_data'],
				returning: true
			});
		})
		.then((user) => {
			return res.json(user.id_data);
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'POST /plugins/kyc/verify err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
});

app.post('/plugins/kyc/revoke', [
	toolsLib.security.verifyBearerTokenExpressMiddleware(['admin', 'supervisor', 'support', 'kyc']),
	expressValidator.checkSchema({
		user_id: {
			in: ['body'],
			errorMessage: 'must be an integer',
			isInt: true,
			optional: false
		},
		message: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			isLength: {
				errorMessage: 'must be minimum length of 1',
				options: { min: 1 }
			},
			optional: true
		}
	})
], (req, res) => {
	const errors = expressValidator.validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	loggerPlugin.verbose(
		req.uuid,
		'POST /plugins/kyc/revoke auth',
		req.auth.sub
	);

	const user_id = req.body.user_id;
	const message = req.body.message || 'Unspecified';

	loggerPlugin.info(
		req.uuid,
		'POST /plugins/kyc/revoke user_id',
		user_id
	);

	toolsLib.user.getUserByKitId(user_id, false)
		.then((user) => {
			if (!user) {
				throw new Error('User not found');
			}

			if (user.id_data.status === VERIFY_STATUS.REJECTED) {
				throw new Error('ID already revoked');
			}

			return toolsLib.database.getModel('sequelize')
				.transaction((transaction) => {
					return Promise.all([
						user.update({
							id_data: { ...user.id_data, status: VERIFY_STATUS.REJECTED, note: message }
						}, {
							fields: ['id_data'],
							returning: true,
							transaction
						}),
						toolsLib.database.destroy('verification image', {
							where: { user_id: user.id }
						}, { transaction })
					]);
				});
		})
		.then(([ user ]) => {
			const emailData = { type: 'id', message };

			toolsLib.sendEmail('USER_VERIFICATION_REJECT', user.email, emailData, user.settings);

			return res.json(user.id_data);
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'POST /plugins/kyc/revoke err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
});

app.post('/plugins/kyc/user/upload', [
	toolsLib.security.verifyBearerTokenExpressMiddleware(['user']),
	upload.fields([
		{ name: 'front', maxCount: 1 },
		{ name: 'back', maxCount: 1 },
		{ name: 'proof_of_residency', maxCount: 1 }
	])
], (req, res) => {
	loggerPlugin.verbose(
		req.uuid,
		'POST /plugins/kyc/user/upload auth',
		req.auth.sub
	);

	const { id } = req.auth.sub;

	let { front, back, proof_of_residency } = req.files;
	if (front) front = front[0];
	if (back) back = back[0];
	if (proof_of_residency) proof_of_residency = proof_of_residency[0];
	const { ...otherData } = req.body;

	let invalidType = '';
	if (!validMimeType(front.mimetype)) {
		invalidType = 'front';
	} else if (back && !validMimeType(back.mimetype)) {
		invalidType = 'back';
	} else if (
		proof_of_residency &&
		!validMimeType(proof_of_residency.mimetype)
	) {
		invalidType = 'proof_of_residency';
	}

	if (invalidType) {
		loggerPlugin.error(req.uuid, 'POST /plugins/kyc/user/upload error', `Invalid type: ${invalidType} field`);
		return res.status(400).json({ message: `Invalid type: ${invalidType} field` });
	}

	const updatedData = { id_data: {} };

	Object.entries(otherData).forEach(([key, field]) => {
		if (field) {
			if (
				key === 'type' ||
				key === 'number' ||
				key === 'issued_date' ||
				key === 'expiration_date'
			) {
				updatedData.id_data[key] = field;
			}
		}
	});

	const ts = moment().valueOf();
	let currentUser;

	toolsLib.user.getUserByKitId(id, false)
		.then((user) => {
			if (!user) {
				throw new Error('User not found');
			}
			currentUser = user;
			let { status } = user.id_data || 0;
			if (status === VERIFY_STATUS.COMPLETED) {
				throw new Error('You are not allowed to upload an approved document');
			}
			return Promise.all([
				uploadFile(
					`${id}/${ts}-front.${getType(front.mimetype)}`,
					front
				),
				back
					? uploadFile(
						`${id}/${ts}-back.${getType(back.mimetype)}`,
						back
					)
					: undefined,
				proof_of_residency
					? uploadFile(
						`${id}/${ts}-proof_of_residency.${getType(
							proof_of_residency.mimetype
						)}`,
						proof_of_residency
					)
					: undefined
			]);
		})
		.then((results) => {
			loggerPlugin.info(req.uuid, 'POST /plugins/kyc/user/upload results', results);
			return toolsLib.database.getModel('sequelize').transaction((transaction) => {
				return toolsLib.database.getModel('verification image').findOrCreate(
					{
						defaults: {
							user_id: currentUser.id,
							front: results[0].Location,
							back: results[1] ? results[1].Location : '',
							proof_of_residency: results[2] ? results[2].Location: ''
						},
						where: { user_id: currentUser.id },
						transaction
					},
				)
					.then(async ([image, created]) => {
						if(!created) {
							await image.update({
								front: results[0].Location,
								back: results[1] ? results[1].Location : '',
								proof_of_residency: results[2] ? results[2].Location: ''
							}, { transaction, fields: ['front', 'back', 'proof_of_residency'] } );
						}

						updatedData.id_data.status = VERIFY_STATUS.PENDING;

						await currentUser.update(updatedData, { transaction, fields: ['id_data'] });

						return;
					});
			});
		})
		.then(() => {
			toolsLib.sendEmail('USER_VERIFICATION', currentUser.email, {}, currentUser.settings);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'POST /plugins/kyc/user/upload error', err.message);
			res.status(400).json({ message: err.message });
		});
});

app.post('/plugins/kyc/admin/upload', [
	toolsLib.security.verifyBearerTokenExpressMiddleware(['admin', 'supervisor']),
	upload.fields([
		{ name: 'front', maxCount: 1 },
		{ name: 'back', maxCount: 1 },
		{ name: 'proof_of_residency', maxCount: 1 }
	])
], (req, res) => {
	loggerPlugin.verbose(req.uuid, 'POST /plugins/kyc/admin/upload auth', req.auth.sub);

	let { front, back, proof_of_residency } = req.files;
	if (front) front = front[0];
	if (back) back = back[0];
	if (proof_of_residency) proof_of_residency = proof_of_residency[0];
	const { ...otherData } = req.body;
	const user_id = req.query.user_id;

	loggerPlugin.info(
		req.uuid,
		'POST /plugins/kyc/admin/upload user_id',
		user_id
	);

	if (
		!front &&
		!back &&
		!proof_of_residency &&
		Object.keys(otherData).length === 0
	) {
		loggerPlugin.error(
			req.uuid,
			'POST /plugins/kyc/admin/upload err',
			'Missing fields'
		);
		return res.status(400).json({ message: 'Missing fields' });
	}

	let invalidType = '';
	if (front && !validMimeType(front.mimetype)) {
		invalidType = 'front';
	} else if (back && !validMimeType(back.mimetype)) {
		invalidType = 'back';
	} else if (
		proof_of_residency &&
		!validMimeType(proof_of_residency.mimetype)
	) {
		invalidType = 'proof_of_residency';
	}
	if (invalidType) {
		loggerPlugin.error(
			req.uuid,
			'POST /plugins/kyc/admin/upload err',
			`Invalid type ${invalidType} field`
		);
		return res.status(400).json({ message: `Invalid type ${invalidType} field` });
	}

	const updatedData = { id_data: { provided: true }};

	Object.entries(otherData).forEach(([key, field]) => {
		if (field) {
			if (
				key === 'type' ||
				key === 'number' ||
				key === 'issued_date' ||
				key === 'expiration_date'
			) {
				updatedData.id_data[key] = field;
			}
		}
	});

	const ts = moment().valueOf();
	let currentUser;

	toolsLib.user.getUserByKitId(user_id, false)
		.then((user) => {
			if (!user) {
				throw new Error('User not found');
			}

			currentUser = user;

			return toolsLib.database.findOne('verification image', {
				where: { user_id: user.id },
				order: [['created_at', 'desc']],
				attributes: ['front', 'back', 'proof_of_residency'],
				raw: true
			});
		})
		.then((verificationImage) => {
			if (!verificationImage) {
				return {
					front: undefined,
					back: undefined,
					proof_of_residency: undefined
				};
			}
			return verificationImage;
		})
		.then((data) => {
			return Promise.all([
				front
					? uploadFile(
						`${user_id}/${ts}-front.${getType(front.mimetype)}`,
						front
					)
					: { Location: data.front },
				back
					? uploadFile(
						`${user_id}/${ts}-back.${getType(back.mimetype)}`,
						back
					)
					: { Location: data.back },
				proof_of_residency
					? uploadFile(
						`${user_id}/${ts}-proof_of_residency.${getType(
							proof_of_residency.mimetype
						)}`,
						proof_of_residency
					)
					: { Location: data.proof_of_residency }
			]);
		})
		.then((results) => {
			loggerPlugin.info(req.uuid, 'POST /plugins/kyc/admin/upload results', results);
			return toolsLib.database.getModel('sequelize').transaction((transaction) => {
				return toolsLib.database.getModel('verification image').findOrCreate(
					{
						defaults: {
							user_id: currentUser.id,
							front: results[0].Location,
							back: results[1] ? results[1].Location : '',
							proof_of_residency: results[2] ? results[2].Location: ''
						},
						where: { user_id: currentUser.id },
						transaction
					},
				)
					.then(async ([image, created]) => {
						let updatedImage = image;
						if(!created) {
							updatedImage = await image.update({
								front: results[0].Location,
								back: results[1] ? results[1].Location : '',
								proof_of_residency: results[2] ? results[2].Location: ''
							}, { transaction, fields: ['front', 'back', 'proof_of_residency'], returning: true } );
						}

						updatedData.id_data.status = VERIFY_STATUS.COMPLETED;

						await currentUser.update(updatedData, { transaction, fields: ['id_data'] });

						return updatedImage;
					});
			});
		})
		.then((data) => {
			data.front = data.front ? getPublicLink(data.front) : data.front;
			data.back = data.back ? getPublicLink(data.back) : data.back;
			data.proof_of_residency  = data.proof_of_residency ? getPublicLink(data.proof_of_residency) : data.proof_of_residency;
			return res.json({ message: 'Success', data });
		})
		.catch((err) => {
			loggerPlugin.error('POST /plugins/kyc/admin/upload err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
});