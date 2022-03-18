export type npmlog = {
  info: (prefix: String, message: String) => void;
  error: (prefix: String, message: String) => void;
  warn: (prefix: String, message: String) => void;
  verbose: (prefix: String, message: String) => void;
  silly: (prefix: String, message: String) => void;
  http: (prefix: String, message: String) => void;
};