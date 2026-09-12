-- ==============================================================================
-- SevaDesk Production Supabase PostgreSQL Schema & Security Architecture
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Types & Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('USER', 'CYBER_CAFE', 'SUPER_ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_status AS ENUM (
        'PENDING',
        'ACCEPTED',
        'IN_PROGRESS',
        'WAITING_FOR_USER',
        'COMPLETED',
        'CANCELLED',
        'REJECTED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Users Table (Linked to auth.users if using Supabase Auth, or standalone)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role user_role DEFAULT 'USER'::user_role NOT NULL,
    phone TEXT,
    state TEXT,
    district TEXT,
    city TEXT,
    pincode TEXT,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Cyber Cafes Directory Table
CREATE TABLE IF NOT EXISTS public.cyber_cafes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    shop_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    opening_hours TEXT NOT NULL DEFAULT '9:00 AM - 8:00 PM',
    services_offered JSONB DEFAULT '[]'::jsonb NOT NULL,
    pricing_json JSONB DEFAULT '{}'::jsonb NOT NULL,
    verification_status verification_status DEFAULT 'PENDING'::verification_status NOT NULL,
    verification_docs_json JSONB DEFAULT '[]'::jsonb NOT NULL,
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.00 NOT NULL,
    review_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT
);

-- 6. Services Directory
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_desc TEXT NOT NULL,
    what_is_it TEXT NOT NULL,
    who_needs_it TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    required_docs_json JSONB DEFAULT '[]'::jsonb NOT NULL,
    steps_json JSONB DEFAULT '[]'::jsonb NOT NULL,
    official_fees TEXT NOT NULL,
    processing_time TEXT NOT NULL,
    where_to_apply TEXT NOT NULL,
    state_specific_notes_json JSONB DEFAULT '[]'::jsonb NOT NULL,
    official_url TEXT NOT NULL,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    template_id UUID,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Document Templates
CREATE TABLE IF NOT EXISTS public.document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    layout_type TEXT DEFAULT 'STANDARD_A4' NOT NULL,
    instructions TEXT NOT NULL,
    disclaimer TEXT NOT NULL,
    fields_json JSONB DEFAULT '[]'::jsonb NOT NULL,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. User Documents (Stored privately, strict privacy protection)
CREATE TABLE IF NOT EXISTS public.user_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.document_templates(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    form_data_json JSONB DEFAULT '{}'::jsonb NOT NULL,
    status TEXT DEFAULT 'DRAFT' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. Service Requests (Citizen to Cyber Cafe)
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cyber_cafe_id UUID NOT NULL REFERENCES public.cyber_cafes(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    user_document_id UUID REFERENCES public.user_documents(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status request_status DEFAULT 'PENDING'::request_status NOT NULL,
    quote_amount NUMERIC(10, 2),
    is_paid BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. Conversations & Messages
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    request_id UUID UNIQUE REFERENCES public.service_requests(id) ON DELETE CASCADE,
    last_message_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachment_url TEXT,
    attachment_name TEXT,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID UNIQUE NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cyber_cafe_id UUID NOT NULL REFERENCES public.cyber_cafes(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    is_moderated BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 12. Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan TEXT NOT NULL,
    status TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    start_date TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    end_date TIMESTAMPTZ,
    payment_ref TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 13. Ad Unlocks
CREATE TABLE IF NOT EXISTS public.ad_unlocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    unlock_token TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cyber_cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_unlocks ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are readable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Cyber Cafes Policies
CREATE POLICY "Cyber Cafes directory is readable by everyone"
    ON public.cyber_cafes FOR SELECT
    USING (true);

CREATE POLICY "Operators can update their own Cyber Cafe"
    ON public.cyber_cafes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Operators can register their own Cyber Cafe"
    ON public.cyber_cafes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Categories & Services Policies (Public view, Admin manage)
CREATE POLICY "Categories are readable by everyone"
    ON public.categories FOR SELECT
    USING (true);

CREATE POLICY "Published services are readable by everyone"
    ON public.services FOR SELECT
    USING (is_published = true);

CREATE POLICY "Published templates are readable by everyone"
    ON public.document_templates FOR SELECT
    USING (is_published = true);

-- User Documents: Strictly Private
CREATE POLICY "Users can only view their own documents"
    ON public.user_documents FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
    ON public.user_documents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
    ON public.user_documents FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
    ON public.user_documents FOR DELETE
    USING (auth.uid() = user_id);

-- Service Requests: Accessible to citizen requester and assigned cafe owner
CREATE POLICY "Users and operators can view their associated service requests"
    ON public.service_requests FOR SELECT
    USING (
        auth.uid() = user_id OR
        auth.uid() IN (SELECT user_id FROM public.cyber_cafes WHERE id = cyber_cafe_id)
    );

CREATE POLICY "Users can create service requests"
    ON public.service_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Operators and users can update request status"
    ON public.service_requests FOR UPDATE
    USING (
        auth.uid() = user_id OR
        auth.uid() IN (SELECT user_id FROM public.cyber_cafes WHERE id = cyber_cafe_id)
    );

-- Messages: Accessible to conversation participants
CREATE POLICY "Participants can view conversation messages"
    ON public.messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = conversation_id AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
        )
    );

CREATE POLICY "Participants can send messages"
    ON public.messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = conversation_id AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
        )
    );

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_cyber_cafes_city ON public.cyber_cafes(city);
CREATE INDEX IF NOT EXISTS idx_cyber_cafes_state ON public.cyber_cafes(state);
CREATE INDEX IF NOT EXISTS idx_cyber_cafes_status ON public.cyber_cafes(verification_status);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_user_documents_user ON public.user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_user ON public.service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_cafe ON public.service_requests(cyber_cafe_id);
