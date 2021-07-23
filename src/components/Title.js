import React from "react";
import { withKit } from './KitContext';

const Title = ({ user: { username } = {}, message = 'Hello' }) => <h1>{`${message} ${username}`}</h1>;

const extraProps = ({ user }) => ({ user });
export default withKit(extraProps)(Title);
