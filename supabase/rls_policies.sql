-- ==============================================================================
-- SevaDesk Production Row Level Security (RLS) Policies
-- Database: Supabase PostgreSQL
-- ==============================================================================

-- 1. Helper Functions to Resolve Current SevaDesk User & Role
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS text AS $$
  SELECT id FROM public."User" 
  WHERE "supabaseAuthId" = auth.uid()::text 
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text AS $$
  SELECT role FROM public."User" 
  WHERE "supabaseAuthId" = auth.uid()::text 
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_current_cafe_id()
RETURNS text AS $$
  SELECT c.id FROM public."CyberCafe" c
  JOIN public."User" u ON c."userId" = u.id
  WHERE u."supabaseAuthId" = auth.uid()::text
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ==============================================================================
-- 2. Enable RLS on All Application Tables
-- ==============================================================================
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CyberCafe" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Service" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DocumentTemplate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."UserDocument" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ServiceRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."RequestStatusHistory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Conversation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."AdUnlock" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Report" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."AuditLog" ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 3. Public Read Catalogs (Services, Categories, Templates)
-- ==============================================================================

-- Categories: Anyone can read, only Super Admin can write
CREATE POLICY "Categories are readable by everyone"
ON public."Category" FOR SELECT
USING (true);

CREATE POLICY "Categories manageable only by Super Admin"
ON public."Category" FOR ALL
USING (public.get_current_user_role() = 'SUPER_ADMIN');

-- Services: Anyone can read published services, Super Admin manages all
CREATE POLICY "Published services are readable by everyone"
ON public."Service" FOR SELECT
USING ("isPublished" = true OR public.get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "Services manageable only by Super Admin"
ON public."Service" FOR ALL
USING (public.get_current_user_role() = 'SUPER_ADMIN');

-- Document Templates: Anyone can view published templates
CREATE POLICY "Published templates are readable by everyone"
ON public."DocumentTemplate" FOR SELECT
USING ("isPublished" = true OR public.get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "Document templates manageable only by Super Admin"
ON public."DocumentTemplate" FOR ALL
USING (public.get_current_user_role() = 'SUPER_ADMIN');

-- ==============================================================================
-- 4. User Profiles ("User" Table)
-- ==============================================================================
CREATE POLICY "Users can read own profile or Super Admin reads all"
ON public."User" FOR SELECT
USING (
  "supabaseAuthId" = auth.uid()::text 
  OR id = public.get_current_user_id()
  OR public.get_current_user_role() = 'SUPER_ADMIN'
);

CREATE POLICY "Users can update own profile"
ON public."User" FOR UPDATE
USING (
  "supabaseAuthId" = auth.uid()::text 
  OR id = public.get_current_user_id()
  OR public.get_current_user_role() = 'SUPER_ADMIN'
);

-- ==============================================================================
-- 5. Cyber Cafés Directory
-- ==============================================================================
CREATE POLICY "Verified Cyber Cafes are visible to everyone"
ON public."CyberCafe" FOR SELECT
USING (
  "verificationStatus" = 'VERIFIED'
  OR "userId" = public.get_current_user_id()
  OR public.get_current_user_role() = 'SUPER_ADMIN'
);

CREATE POLICY "Operators can update own cafe profile"
ON public."CyberCafe" FOR UPDATE
USING (
  "userId" = public.get_current_user_id()
  OR public.get_current_user_role() = 'SUPER_ADMIN'
);

-- ==============================================================================
-- 6. User Documents & Applications
-- ==============================================================================
CREATE POLICY "Users can read own documents"
ON public."UserDocument" FOR SELECT
USING (
  "userId" = public.get_current_user_id()
  OR public.get_current_user_role() = 'SUPER_ADMIN'
);

CREATE POLICY "Users can insert own documents"
ON public."UserDocument" FOR INSERT
WITH CHECK (
  "userId" = public.get_current_user_id()
);

CREATE POLICY "Users can update own documents"
ON public."UserDocument" FOR UPDATE
USING (
  "userId" = public.get_current_user_id()
  OR public.get_current_user_role() = 'SUPER_ADMIN'
);

CREATE POLICY "Users can delete own documents"
ON public."UserDocument" FOR DELETE
USING (
  "userId" = public.get_current_user_id()
  OR public.get_current_user_role() = 'SUPER_ADMIN'
);

-- ==============================================================================
-- 7. Service Requests & Tracking
-- ==============================================================================
CREATE POLICY "Users and assigned Cafes can view service requests"
ON public."ServiceRequest" FOR SELECT
USING (
  "userId" = public.get_current_user_id()
  OR "cyberCafeId" = public.get_current_cafe_id()
  OR public.get_current_user_role() = 'SUPER_ADMIN'
);

CREATE POLICY "Citizens can create service requests"
ON public."ServiceRequest" FOR INSERT
WITH CHECK (
  "userId" = public.get_current_user_id()
);

CREATE POLICY "Parties can update their service requests"
ON public."ServiceRequest" FOR UPDATE
USING (
  "userId" = public.get_current_user_id()
  OR "cyberCafeId" = public.get_current_cafe_id()
  OR public.get_current_user_role() = 'SUPER_ADMIN'
);

-- Request status history
CREATE POLICY "Parties can view request status history"
ON public."RequestStatusHistory" FOR SELECT
USING (
  "requestId" IN (
    SELECT id FROM public."ServiceRequest"
    WHERE "userId" = public.get_current_user_id()
    OR "cyberCafeId" = public.get_current_cafe_id()
    OR public.get_current_user_role() = 'SUPER_ADMIN'
  )
);

-- ==============================================================================
-- 8. Real-Time Chat (Conversations & Messages)
-- ==============================================================================
CREATE POLICY "Participants can view conversations"
ON public."Conversation" FOR SELECT
USING (
  "requestId" IN (
    SELECT id FROM public."ServiceRequest"
    WHERE "userId" = public.get_current_user_id()
    OR "cyberCafeId" = public.get_current_cafe_id()
    OR public.get_current_user_role() = 'SUPER_ADMIN'
  )
);

CREATE POLICY "Participants can view messages"
ON public."Message" FOR SELECT
USING (
  "conversationId" IN (
    SELECT c.id FROM public."Conversation" c
    JOIN public."ServiceRequest" sr ON c."requestId" = sr.id
    WHERE sr."userId" = public.get_current_user_id()
    OR sr."cyberCafeId" = public.get_current_cafe_id()
    OR public.get_current_user_role() = 'SUPER_ADMIN'
  )
);

CREATE POLICY "Participants can send messages"
ON public."Message" FOR INSERT
WITH CHECK (
  "senderId" = public.get_current_user_id()
);

-- ==============================================================================
-- 9. Reviews
-- ==============================================================================
CREATE POLICY "Moderated reviews are public"
ON public."Review" FOR SELECT
USING ("isModerated" = true OR "userId" = public.get_current_user_id() OR public.get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "Citizens can post reviews"
ON public."Review" FOR INSERT
WITH CHECK ("userId" = public.get_current_user_id());

-- ==============================================================================
-- 10. Subscriptions & Ad Unlocks
-- ==============================================================================
CREATE POLICY "Users can view own subscriptions"
ON public."Subscription" FOR SELECT
USING ("userId" = public.get_current_user_id() OR public.get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "Users can view own ad unlocks"
ON public."AdUnlock" FOR SELECT
USING ("userId" = public.get_current_user_id() OR public.get_current_user_role() = 'SUPER_ADMIN');

-- ==============================================================================
-- 11. Audit Logs & Reports
-- ==============================================================================
CREATE POLICY "Audit logs visible only to Super Admin"
ON public."AuditLog" FOR SELECT
USING (public.get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "Audit logs insertable by authenticated users or system"
ON public."AuditLog" FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Reports insertable by users and readable by Super Admin"
ON public."Report" FOR SELECT
USING ("reporterId" = public.get_current_user_id() OR public.get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "Users can submit reports"
ON public."Report" FOR INSERT
WITH CHECK ("reporterId" = public.get_current_user_id());
