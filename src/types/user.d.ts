export type User = {
  id: string;
  email_addresses: Array<{ email_address: string }>;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  username: string | null;
  created_at: Int; // timestamp (e.g., Date.now())
  updated_at: Int; // timestamp
};
