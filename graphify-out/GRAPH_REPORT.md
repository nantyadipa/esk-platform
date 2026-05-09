# Graph Report - C:\Users\TLab-N087\Documents\SpecDrivenDevelopment\esk-platform  (2026-05-08)

## Corpus Check
- 62 files · ~52,229 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 92 nodes · 83 edges · 11 communities detected
- Extraction: 75% EXTRACTED · 25% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]

## God Nodes (most connected - your core abstractions)
1. `Course Prisma model` - 9 edges
2. `PrismaClient singleton` - 7 edges
3. `generateWhatsAppURL registration action` - 6 edges
4. `ActionResult discriminated union type` - 5 edges
5. `RegistrationForm` - 5 edges
6. `createCourse server action` - 4 edges
7. `updateCourse server action` - 4 edges
8. `Student Prisma model` - 4 edges
9. `Schedule Prisma model` - 4 edges
10. `LandingClient` - 4 edges

## Surprising Connections (you probably didn't know these)
- `getCourses server action` --shares_data_with--> `Course Prisma model`  [EXTRACTED]
  esk-platform/src/lib/actions/course-actions.ts → esk-platform/prisma/schema.prisma
- `getActiveCourses server action` --shares_data_with--> `Course Prisma model`  [EXTRACTED]
  esk-platform/src/lib/actions/course-actions.ts → esk-platform/prisma/schema.prisma
- `registrationFormSchema Zod schema` --conceptually_related_to--> `Student Prisma model`  [INFERRED]
  esk-platform/src/lib/validations.ts → esk-platform/prisma/schema.prisma
- `courseSchema Zod schema` --conceptually_related_to--> `Course Prisma model`  [INFERRED]
  esk-platform/src/lib/validations.ts → esk-platform/prisma/schema.prisma
- `scheduleSchema Zod schema` --conceptually_related_to--> `Schedule Prisma model`  [INFERRED]
  esk-platform/src/lib/validations.ts → esk-platform/prisma/schema.prisma

## Hyperedges (group relationships)
- **Prisma schema mirrors TypeScript types** — types_course, types_student, types_schedule, types_content, types_admin, types_whatsappconfig, prisma_course, prisma_student, prisma_schedule, prisma_content, prisma_admin, prisma_whatsappconfig [EXTRACTED 1.00]
- **Registration with captcha and WhatsApp notification** — registration-actions_verifyhcaptcha, registration-actions_generatewhatsappurl, validations_registrationformschema, types_whatsappconfig, prisma_whatsappconfig [EXTRACTED 1.00]
- **Price formatting and discount calculation utilities** — utils_formatcurrency, utils_calculatefinalprice, utils_formatdiscountdisplay [EXTRACTED 1.00]
- **Course CRUD operations via server actions** — course-actions_getcourses, course-actions_getactivecourses, course-actions_createcourse, course-actions_updatecourse, course-actions_deletecourse, validations_courseschema, db_prisma, prisma_course [EXTRACTED 1.00]
- **Student-Schedule many-to-many relationship** — prisma_student, prisma_schedule, prisma_schedulestudent [EXTRACTED 1.00]
- **Course Selection to Registration Flow** — landing-client, course-card, registration-form [EXTRACTED 1.00]
- **Auth Context Distribution Pattern** — auth-provider, use-auth, admin-sidebar [EXTRACTED 1.00]
- **Admin Route Protection Pattern** — middleware, admin-login-form, auth-provider [EXTRACTED 1.00]

## Communities (30 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.27
Nodes (13): logout server action, createClient Supabase factory, createCourse server action, deleteCourse server action, getActiveCourses server action, getCourses server action, updateCourse server action, PrismaClient singleton (+5 more)

### Community 1 - "Community 1"
Cohesion: 0.2
Nodes (10): Schedule Prisma model, ScheduleMode enum, ScheduleStudent Prisma model, Student Prisma model, StudentMode enum, StudentStatus enum, Schedule TypeScript type, Student TypeScript type (+2 more)

### Community 2 - "Community 2"
Cohesion: 0.32
Nodes (8): CourseCard, Course type, FormState type, generateWhatsAppURL action, LandingClient, LandingPage, RegistrationForm, registrationFormSchema

### Community 3 - "Community 3"
Cohesion: 0.47
Nodes (6): AdminLoginForm, AdminSidebar, AuthProvider, AuthMiddleware, useAuth hook, User type

### Community 4 - "Community 4"
Cohesion: 0.4
Nodes (5): WhatsAppConfig Prisma model, generateWhatsAppURL registration action, verifyHCaptcha function, WhatsAppConfig TypeScript type, generateWhatsAppURL utility

### Community 7 - "Community 7"
Cohesion: 1.0
Nodes (3): calculateFinalPrice discount calculator, formatCurrency IDR formatter, formatDiscountDisplay helper

### Community 8 - "Community 8"
Cohesion: 0.67
Nodes (3): Admin Prisma model, AdminRole enum, Admin TypeScript type

### Community 9 - "Community 9"
Cohesion: 0.67
Nodes (3): Content Prisma model, ContentType enum, Content TypeScript type

## Knowledge Gaps
- **18 isolated node(s):** `verifyHCaptcha function`, `cn className utility`, `generateWhatsAppURL utility`, `studentSchema Zod schema`, `scheduleSchema Zod schema` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Course Prisma model` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `generateWhatsAppURL registration action` connect `Community 4` to `Community 0`, `Community 1`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `Student Prisma model` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `generateWhatsAppURL registration action` (e.g. with `generateWhatsAppURL utility` and `ActionResult discriminated union type`) actually correct?**
  _`generateWhatsAppURL registration action` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `ActionResult discriminated union type` (e.g. with `createCourse server action` and `updateCourse server action`) actually correct?**
  _`ActionResult discriminated union type` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `verifyHCaptcha function`, `cn className utility`, `generateWhatsAppURL utility` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._