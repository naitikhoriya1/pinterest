import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import User from "./auth.model";

const signToken = (id: string) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
  };
  return jwt.sign({ id }, process.env.JWT_SECRET as string, options);
};

export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = signToken(user._id.toString());
  return { user, token };
};

/**
 * Called by the frontend after a successful Clerk sign-in.
 * Finds or creates a local MongoDB user keyed by clerkId, then issues
 * a custom JWT so all protected /api/* endpoints can use a single auth strategy.
 */
export const clerkSyncUser = async (opts: {
  clerkId: string;
  email: string;
  username: string;
  avatarUrl?: string;
}) => {
  let user = await User.findOne({ clerkId: opts.clerkId });

  if (!user) {
    // Also try matching by email (handles legacy accounts created before Clerk)
    user = await User.findOne({ email: opts.email });
    if (user && !user.clerkId) {
      user.clerkId = opts.clerkId;
      if (opts.avatarUrl) user.avatarUrl = opts.avatarUrl;
      await user.save();
    } else if (!user) {
      user = await User.create({
        clerkId: opts.clerkId,
        email: opts.email,
        username: opts.username,
        avatarUrl: opts.avatarUrl,
        password: "__clerk__", // placeholder — will never be used for login
      });
    }
  }

  const token = signToken(user._id.toString());
  return { user, token };
};
