import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const members = sqliteTable('members', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  segment: text('segment', { enum: ['ghanaian', 'diaspora', 'institutional'] }).notNull(),
  kycStatus: text('kyc_status', { enum: ['pending', 'approved', 'rejected', 'needs_info'] }).default('pending').notNull(),
  tier: text('tier', { enum: ['guest', 'member', 'owner-investor'] }).default('guest').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
}, (t) => [
  index('members_email_idx').on(t.email),
]);

export const capsules = sqliteTable('capsules', {
  id: text('id').primaryKey(),
  hub: text('hub').notNull(),
  name: text('name').notNull(),
  phase: integer('phase').notNull(),
  status: text('status', { enum: ['building', 'in-revenue', 'completed'] }).notNull(),
  priceUsd: integer('price_usd').notNull(),
  areaSqm: integer('area_sqm').default(38).notNull(),
  shareRatio: text('share_ratio').default('70/30').notNull(),
  imageR2Key: text('image_r2_key'),
});

export const ownerships = sqliteTable('ownerships', {
  memberId: text('member_id').references(() => members.id).notNull(),
  capsuleId: text('capsule_id').references(() => capsules.id).notNull(),
  ownedSince: integer('owned_since').notNull(),
  capitalUnits: integer('capital_units').default(0).notNull(),
  incomeUnits: integer('income_units').default(0).notNull(),
  lockInUntil: integer('lock_in_until'),
  paymentPlanJson: text('payment_plan_json'),
}, (t) => [
  index('ownerships_member_idx').on(t.memberId),
  index('ownerships_capsule_idx').on(t.capsuleId),
]);

export const revenueLedger = sqliteTable('revenue_ledger', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  capsuleId: text('capsule_id').references(() => capsules.id).notNull(),
  month: text('month').notNull(),
  grossUsd: integer('gross_usd').notNull(),
  ownerShareUsd: integer('owner_share_usd').notNull(),
  status: text('status', { enum: ['paid', 'pending', 'processing'] }).notNull(),
  paidAt: integer('paid_at'),
}, (t) => [
  index('revenue_ledger_capsule_idx').on(t.capsuleId),
  index('revenue_ledger_month_idx').on(t.month),
]);

export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  memberId: text('member_id').references(() => members.id),
  capsuleId: text('capsule_id').references(() => capsules.id),
  type: text('type').notNull(),
  name: text('name').notNull(),
  r2Key: text('r2_key').notNull(),
  mimeType: text('mime_type'),
  sizeBytes: integer('size_bytes'),
  status: text('status', { enum: ['signed', 'issued', 'sealed', 'current', 'ready', 'rev'] }).notNull(),
  createdAt: integer('created_at').notNull(),
}, (t) => [
  index('documents_member_idx').on(t.memberId),
  index('documents_capsule_idx').on(t.capsuleId),
]);

export const briefings = sqliteTable('briefings', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  scheduledAt: integer('scheduled_at').notNull(),
  durationMin: integer('duration_min').default(45).notNull(),
  host: text('host'),
  recordingR2Key: text('recording_r2_key'),
  notesR2Key: text('notes_r2_key'),
  isEncrypted: integer('is_encrypted', { mode: 'boolean' }).default(true).notNull(),
});

export const briefingAttendees = sqliteTable('briefing_attendees', {
  briefingId: text('briefing_id').references(() => briefings.id).notNull(),
  memberId: text('member_id').references(() => members.id).notNull(),
  attended: integer('attended', { mode: 'boolean' }).default(false).notNull(),
}, (t) => [
  index('briefing_attendees_member_idx').on(t.memberId),
]);

export const listings = sqliteTable('listings', {
  id: text('id').primaryKey(),
  capsuleId: text('capsule_id').references(() => capsules.id).notNull(),
  sellerMemberId: text('seller_member_id').references(() => members.id).notNull(),
  type: text('type', { enum: ['transfer', 'auction'] }).notNull(),
  askingPriceUsd: integer('asking_price_usd'),
  reservePriceUsd: integer('reserve_price_usd'),
  status: text('status', { enum: ['active', 'reserve_met', 'sold', 'expired'] }).notNull(),
  expiresAt: integer('expires_at'),
  createdAt: integer('created_at').notNull(),
}, (t) => [
  index('listings_capsule_idx').on(t.capsuleId),
  index('listings_seller_idx').on(t.sellerMemberId),
]);

export const bids = sqliteTable('bids', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  listingId: text('listing_id').references(() => listings.id).notNull(),
  bidderMemberId: text('bidder_member_id').references(() => members.id).notNull(),
  amountUsd: integer('amount_usd').notNull(),
  createdAt: integer('created_at').notNull(),
}, (t) => [
  index('bids_listing_idx').on(t.listingId),
  index('bids_bidder_idx').on(t.bidderMemberId),
]);

export const adminUsers = sqliteTable('admin_users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['superadmin', 'support', 'finance', 'kyc'] }).notNull(),
  createdAt: integer('created_at').notNull(),
});

export const payouts = sqliteTable('payouts', {
  id: text('id').primaryKey(),
  memberId: text('member_id').references(() => members.id).notNull(),
  capsuleId: text('capsule_id').references(() => capsules.id).notNull(),
  amountUsd: integer('amount_usd').notNull(),
  status: text('status', { enum: ['pending', 'processing', 'completed', 'failed'] }).notNull(),
  scheduledFor: integer('scheduled_for').notNull(),
  processedAt: integer('processed_at'),
  bankDetailsJson: text('bank_details_json'),
}, (t) => [
  index('payouts_member_idx').on(t.memberId),
  index('payouts_capsule_idx').on(t.capsuleId),
]);

export const kycReviews = sqliteTable('kyc_reviews', {
  id: text('id').primaryKey(),
  memberId: text('member_id').references(() => members.id).notNull(),
  adminId: text('admin_id').references(() => adminUsers.id),
  status: text('status', { enum: ['pending', 'approved', 'rejected', 'needs_info'] }).notNull(),
  decisionNotes: text('decision_notes'),
  submittedAt: integer('submitted_at').notNull(),
  reviewedAt: integer('reviewed_at'),
}, (t) => [
  index('kyc_reviews_member_idx').on(t.memberId),
]);

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  memberId: text('member_id').references(() => members.id).notNull(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  body: text('body'),
  dataJson: text('data_json'),
  readAt: integer('read_at'),
  createdAt: integer('created_at').notNull(),
}, (t) => [
  index('notifications_member_idx').on(t.memberId),
  index('notifications_read_idx').on(t.readAt),
]);

export const feedback = sqliteTable('feedback', {
  slug: text('slug').primaryKey(),
  helpful: integer('helpful').default(0).notNull(),
  notHelpful: integer('not_helpful').default(0).notNull(),
});
/**
 * Enquiries from the public contact form.
 *
 * /api/contact previously validated the submission and discarded it, so a
 * completed enquiry went nowhere. There is no other table this fits: `feedback`
 * is page voting, and `notifications.member_id` is NOT NULL so it cannot hold a
 * message from someone who is not yet a member.
 */
export const contactEnquiries = sqliteTable(
  'contact_enquiries',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    message: text('message').notNull(),
    source: text('source').default('contact').notNull(),
    handled: integer('handled', { mode: 'boolean' }).default(false).notNull(),
    createdAt: integer('created_at').notNull(),
  },
  (t) => [index('contact_enquiries_created_idx').on(t.createdAt)]
);

/**
 * Photographs for a capsule.
 *
 * `capsules.image_r2_key` holds a single hero image only, which cannot carry a
 * gallery. Onboarding a prefab means attaching the whole set, so each upload
 * gets its own row and an explicit position for ordering.
 *
 * R2 keys are never exposed to members; they are served through
 * /api/capsules/[id]/images, which checks the caller's session.
 */
export const capsuleImages = sqliteTable(
  'capsule_images',
  {
    id: text('id').primaryKey(),
    capsuleId: text('capsule_id')
      .references(() => capsules.id)
      .notNull(),
    r2Key: text('r2_key').notNull(),
    /** First image is the hero shown wherever a capsule appears as a card. */
    isHero: integer('is_hero', { mode: 'boolean' }).default(false).notNull(),
    position: integer('position').default(0).notNull(),
    width: integer('width'),
    height: integer('height'),
    mimeType: text('mime_type'),
    sizeBytes: integer('size_bytes'),
    /** Free-text provenance, e.g. "Alibaba supplier reference". */
    caption: text('caption'),
    createdAt: integer('created_at').notNull(),
  },
  (t) => [
    index('capsule_images_capsule_idx').on(t.capsuleId),
    index('capsule_images_position_idx').on(t.capsuleId, t.position),
  ]
);

/**
 * Reusable outbound message bodies for the operator console's composer.
 *
 * Only the subject and plain-text body are stored. Keeping templates to plain
 * text is deliberate: a stored HTML template is a stored injection surface,
 * because whatever renders it later has to escape whatever the operator typed.
 */
export const emailTemplates = sqliteTable(
  'email_templates',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    subject: text('subject').notNull(),
    body: text('body').notNull(),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (t) => [index('email_templates_updated_idx').on(t.updatedAt)]
);
