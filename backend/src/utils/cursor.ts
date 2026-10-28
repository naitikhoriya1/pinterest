import { Types } from "mongoose";

export interface ParsedCursor {
  date: Date;
  objectId: Types.ObjectId;
}

/**
 * Shared helper to validate and parse cursor `<ISO createdAt>_<ObjectId>`.
 * Returns { date, objectId } if valid, or null if malformed.
 */
export const parseCursor = (
  cursor: unknown
): ParsedCursor | null => {
  if (typeof cursor !== "string") return null;
  const parts = cursor.split("_");
  if (parts.length !== 2) return null;
  const [dateStr, idStr] = parts;
  const date = new Date(dateStr);
  if (
    isNaN(date.getTime()) ||
    !Types.ObjectId.isValid(idStr) ||
    !/^[0-9a-fA-F]{24}$/.test(idStr)
  ) {
    return null;
  }
  return { date, objectId: new Types.ObjectId(idStr) };
};
