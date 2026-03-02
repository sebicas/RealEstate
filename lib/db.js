import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON(filename) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    return [];
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function writeJSON(filename, data) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Users
export function getUsers() {
  return readJSON("users.json");
}

export function getUserById(id) {
  const users = getUsers();
  return users.find((u) => u.id === id) || null;
}

export function getUserByEmail(email) {
  const users = getUsers();
  return users.find((u) => u.email === email.toLowerCase()) || null;
}

export function createUser(user) {
  const users = getUsers();
  users.push(user);
  writeJSON("users.json", users);
  return user;
}

// Listings
export function getListings() {
  return readJSON("listings.json");
}

export function getListingById(id) {
  const listings = getListings();
  return listings.find((l) => l.id === id) || null;
}

export function getListingsByUserId(userId) {
  const listings = getListings();
  return listings.filter((l) => l.userId === userId);
}

export function createListing(listing) {
  const listings = getListings();
  listings.push(listing);
  writeJSON("listings.json", listings);
  return listing;
}

export function updateListing(id, updates) {
  const listings = getListings();
  const index = listings.findIndex((l) => l.id === id);
  if (index === -1) return null;
  listings[index] = {
    ...listings[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeJSON("listings.json", listings);
  return listings[index];
}

export function deleteListing(id) {
  let listings = getListings();
  const listing = listings.find((l) => l.id === id);
  if (!listing) return false;
  listings = listings.filter((l) => l.id !== id);
  writeJSON("listings.json", listings);
  return true;
}
