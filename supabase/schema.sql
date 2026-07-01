-- Supabase schema for ClearRun demo

-- Organizations
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  phone text,
  email text,
  address jsonb,
  branding_logo text,
  primary_color text,
  created_at timestamptz default now()
);

-- Users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  name text,
  email text unique,
  role text,
  status text,
  created_at timestamptz default now()
);

-- ServiceRecords
create table if not exists service_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  hauler_company_id uuid,
  technician_id uuid,
  restaurant_id uuid,
  facility_id uuid,
  service_date timestamptz,
  service_type text,
  fog_volume_gallons numeric,
  estimated_revenue numeric,
  trap_condition text,
  before_photo_url text,
  after_photo_url text,
  receipt_photo_url text,
  notes text,
  customer_signature text,
  hauler_attestation boolean,
  proof_status text,
  offline_client_id text,
  sync_status text,
  disposal_facility_id uuid,
  disposal_confirmation_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ProofRequests
create table if not exists proof_requests (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid,
  requester_name text,
  requester_email text,
  facility_address text,
  current_hauler_email text,
  assigned_hauler_organization_id uuid,
  status text,
  secure_token text,
  token_expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- AuditLog
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  actor_user_id uuid,
  actor_label text,
  entity_type text,
  entity_id text,
  action text,
  summary jsonb,
  created_at timestamptz default now()
);
