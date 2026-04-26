const enMessages = {
  common: {
    appName: "Registry Studio",
    locale: {
      en: "English",
      fa: "Persian",
      ar: "Arabic",
      switchLabel: "Language",
    },
    actions: {
      backToSignIn: "Back to sign-in",
      checkInbox: "Check your inbox",
      continueWithMagicLink: "Continue with magic link",
      continueWithPassword: "Continue with password",
      creating: "Creating...",
      inventoryRequired: "Inventory service required",
      openDashboard: "Open dashboard",
      refresh: "Refresh",
      requestedDestination: "Requested destination",
      returnToSite: "Return to the site",
      sending: "Sending...",
      sendingMagicLink: "Sending magic link...",
      signOut: "Sign out",
      signingIn: "Signing in...",
      startConversation: "Start conversation",
    },
    pagination: {
      nextPage: "Next page",
      previousPage: "Previous page",
      pageOf: "Page {page} of {total}",
      showingRows: "Showing {visible} of {total} rows",
    },
    states: {
      disabled: "Service disabled",
      enabled: "Service enabled",
      fallbackFlagOff: "Fallback flag off",
      fallbackFlagOn: "Fallback flag on",
      healthUnknown: "Health unknown",
      healthy: "Healthy",
      checkingService: "Checking service",
      serviceUnreachable: "Service unreachable",
      stub: "Stub prepared",
      writesOff: "Writes off",
      writesPlanned: "Writes planned",
    },
  },
  auth: {
    meta: {
      title: "Sign in",
      description:
        "Authenticate into the Registry Studio dashboard with email and password or a magic link.",
    },
    hero: {
      eyebrow: "Registry Studio",
      title: "Secure operations and messaging with one shared workspace identity.",
      description:
        "The workspace platform now handles auth, organization access, inventory views, adoption metrics, saved settings, and the first messaging surfaces for doctor and patient flows.",
    },
    form: {
      title: "Sign in to Registry Studio",
      description:
        "Use your email and password to enter the protected dashboard or messaging portals. Magic links remain available as a fallback. Organization membership is still enforced for dashboard and doctor surfaces, while patient messaging uses direct authenticated access.",
      workEmail: "Work email",
      workEmailPlaceholder: "name@registry.studio",
      workEmailDescription:
        "The first authenticated user becomes the initial workspace owner in local development. Later sign-ins can also reach patient messaging without membership.",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      passwordDescription:
        "Local QA accounts can use a shared development password instead of Mailpit.",
      magicLinkDivider: "or use magic link",
      messageRedirecting:
        "Password sign-in succeeded. Redirecting to your workspace...",
      messageMagicLink:
        "Magic link sent to {email}. Open the link from your inbox to enter the workspace.",
    },
    status: {
      authErrorTitle: "Authentication link could not be verified",
      authErrorDescription:
        "Check your email and password or request a fresh magic link before trying again.",
      backendRequiredTitle: "Backend is not configured",
      backendRequiredDescription:
        "Set the required local environment variables before using dashboard auth.",
      couldNotComplete: "Could not complete sign-in",
      couldNotSignIn: "Could not sign in",
      signingYouIn: "Signing you in",
    },
    errors: {
      backendMissing:
        "The backend is not configured yet. Add the required environment values before signing in.",
      backendMissingMagic:
        "The backend is not configured yet. Add the required environment values before requesting a magic link.",
      passwordUnexpected: "Password sign-in failed unexpectedly.",
      magicLinkUnexpected: "Magic-link sign-in failed unexpectedly.",
    },
    accessDenied: {
      metaTitle: "Access denied",
      metaDescription:
        "Explain why a signed-in user cannot reach a protected Registry Studio surface yet.",
      dashboardTitle:
        "You are signed in, but not assigned to a workspace organization.",
      dashboardDescription:
        "Registry Studio uses organization memberships for dashboard access. Ask an owner or admin to invite your email before trying again.",
      doctorTitle:
        "Doctor messaging is only available to organization members.",
      doctorDescription:
        "Sign in with a doctor or staff account that belongs to the Registry Studio organization before opening the doctor inbox.",
      patientTitle:
        "Patient messaging is only available to non-staff patient accounts.",
      patientDescription:
        "Use a patient-facing account to open the patient inbox. Organization members should stay in the dashboard or doctor surfaces.",
    },
  },
  navigation: {
    dashboard: {
      subtitle: "Design system operations",
      stageLabel: "Internal MVP",
      footerTitle: "Core surfaces",
      footerDescription:
        "Overview, workspaces, adoption, inventory, messages, settings",
      groupLabel: "Studio",
      overview: {
        title: "Overview",
        hint: "Workspace health, release readiness, and operating priorities",
      },
      workspaces: {
        title: "Workspaces",
        hint: "Registry workspaces, styles, publishing status, and install volume",
      },
      adoption: {
        title: "Adoption",
        hint: "Install activity, preview usage, and component adoption trends",
      },
      inventory: {
        title: "Inventory",
        hint: "Warehouse preparation, stock visibility, locations, and supplier references",
      },
      messages: {
        title: "Messages",
        hint: "Patient-doctor conversation oversight, unread queues, and reply pressure",
      },
      appointments: {
        title: "Appointments",
        hint: "Scheduling surface prepared for a future self-hosted Cal.com activation",
      },
      settings: {
        title: "Settings",
        hint: "Workspace defaults, publishing rules, and operational controls",
      },
      fallbackHint: "Workspace and adoption operations",
    },
    messagingShell: {
      dashboard: {
        label: "Dashboard",
        description: "Operational oversight",
      },
      doctor: {
        label: "Doctor workspace",
        description: "Assigned clinician workspace",
      },
      patient: {
        label: "Patient workspace",
        description: "Secure patient care portal",
      },
      messages: "Messages",
      appointments: "Appointments",
    },
  },
  messaging: {
    meta: {
      dashboardTitle: "Messages",
      dashboardDescription:
        "Monitor live patient-doctor threads, reply pressure, and unresolved conversation status without leaving the operations dashboard.",
      doctorTitle: "Doctor messages",
      doctorDescription:
        "Review assigned conversations, reply to patient updates, and keep {appName} moving from one focused inbox.",
      patientTitle: "Patient messages",
      patientDescription:
        "Use {appName} to start a consultation, share follow-up details, and check for doctor replies in one thread-based inbox.",
    },
    transport: {
      matrix: "Matrix transport",
      mock: "Mock transport",
    },
    roles: {
      admin: "Admin",
      doctor: "Doctor",
      patient: "Patient",
    },
    threadStatus: {
      active: "Active",
      awaiting_reply: "Awaiting reply",
      closed: "Closed",
    },
    filters: {
      all: "All",
      active: "Active",
      awaiting_reply: "Awaiting reply",
      closed: "Closed",
    },
    errors: {
      requestFailed: "Messaging request failed.",
      matrixUnavailable: "Matrix messaging is unavailable",
      appNotReady: "{appName} is not ready",
      actionFailed: "Action failed",
      sendFailed: "Could not send the message.",
      createFailed: "Could not create the conversation.",
    },
    shell: {
      conversations: "Conversations",
      transportDescriptionDashboard:
        "Operational inbox across assigned doctor and patient threads.",
      transportDescriptionDoctor:
        "Assigned doctor conversations with polling-based refresh.",
      transportDescriptionPatient:
        "Your direct conversation history with the care team.",
      selectDashboard:
        "Select a conversation to inspect its latest messages and reply pressure.",
      selectDoctor:
        "Select a patient conversation to review the latest update and reply from the doctor workspace.",
      selectPatient:
        "Start a new consultation or select an existing thread to continue the conversation.",
      conversation: "Conversation",
      conversationDetail: "Conversation detail",
      counterpartThread: "Thread with {name}",
      dashboardThread: "{patient} with {doctor}",
      doctorConversation: "Doctor conversation",
      patientConversation: "Patient conversation",
      unread: "Unread",
      updated: "Updated",
      noThreadsTitle: "No conversations yet",
      noThreadsDescription:
        "Create or wait for the first thread so this inbox can show the current care conversation flow.",
      patientNoThreadsDescription:
        "Use the form above to start your first secure conversation with the care team.",
      doctorNoThreadsDescription:
        "Patient conversations will appear here as new threads are assigned to you.",
      dashboardNoThreadsDescription:
        "Organization threads will appear here as patients start new conversations.",
      noMessagesTitle: "No messages yet",
      noMessagesDescription:
        "This thread exists, but no persisted messages are available yet.",
      loadingThreads: "Loading conversations...",
      loadingMessages: "Loading messages...",
      selectThreadTitle: "Select a thread",
      selectThreadDescription:
        "Open a conversation from the list to review the live message history.",
      replyPlaceholder:
        "Add a reply, summary, or next step for the conversation.",
      doctorReplyPlaceholder:
        "Reply with the next clinical step or follow-up request.",
      patientReplyPlaceholder: "Add more details or ask a follow-up question.",
      subject: "Subject",
      subjectPlaceholder: "Follow-up question after visit",
      firstMessage: "First message",
      firstMessagePlaceholder:
        "Describe your question, symptoms, or follow-up request.",
      startConversation: "Start conversation",
      sendReply: "Send reply",
      creating: "Creating...",
      sending: "Sending...",
      inventoryUpdated: "Message sent",
      messageSent: "Message sent",
      threadCreated: "Conversation created",
      patientStartTitle: "Start a new conversation",
      patientStartDescription:
        "Open a new patient-to-doctor thread when you need a follow-up or a new secure question.",
      dashboardReadonly:
        "Dashboard mode is read-only by design in this phase. Use the doctor or patient portal to send live replies while operations monitors queue health here.",
      activeRole: "{role} access",
      roleUnavailable: "Role unavailable",
    },
  },
  inventory: {
    title: "Inventory",
    errors: {
      requestFailed: "Inventory request failed.",
      unavailable: "Inventory service unavailable",
      actionFailed: "Inventory action failed",
      actionSucceeded: "Inventory updated",
      backendNotConfigured: "Inventory backend not configured",
      writesHeldTitle: "Writes are held behind the local fallback flag",
      writesHeldDescription:
        "You have an operator role, but stock mutations stay hidden until `inventory.writes.enabled` is turned on.",
    },
    actions: {
      adjustStock: "Adjust stock",
      transferStock: "Transfer stock",
      receiveStock: "Receive stock",
      viewStock: "View stock",
      submitAdjustment: "Submit adjustment",
      submitTransfer: "Submit transfer",
      submitReceipt: "Submit receipt",
      refresh: "Refresh",
    },
    labels: {
      roleUnavailable: "Role unavailable",
      writesEnabled: "Writes enabled",
      readOnly: "Read only",
      notAssigned: "Not assigned",
      notTracked: "Not tracked",
      unknownSource: "Unknown source",
      unknownDestination: "Unknown destination",
      noNoteRecorded: "No note recorded",
      noDescriptionAvailable: "No description available",
      optional: "Optional",
      quantity: "Quantity",
      quantityDelta: "Quantity delta",
      note: "Note",
      destinationLocation: "Destination location",
      product: "Product",
      supplierId: "Supplier ID",
      supplierPartId: "Supplier-part ID",
      allCategories: "All categories",
      allProducts: "All products",
      allLocations: "All locations",
      allStatuses: "All statuses",
      selectDestination: "Select a destination",
      selectLocation: "Select a location",
      selectProduct: "Select a product",
    },
    filters: {
      searchProducts: "Search product, SKU, or default location",
      searchStock: "Search product, serial, or batch",
      filterByProduct: "Filter by product",
      filterByLocation: "Filter by source or destination",
      searchSuppliers: "Search supplier or description",
    },
    columns: {
      sku: "SKU",
      product: "Product",
      totalStock: "Total stock",
      available: "Available",
      defaultLocation: "Default location",
      quantity: "Quantity",
      location: "Location",
      status: "Status",
      serialBatch: "Serial / batch",
      updated: "Updated",
      locationPath: "Location path",
      children: "Children",
      stockCount: "Stock count",
      timestamp: "Timestamp",
      action: "Action",
      delta: "Delta",
      movementPath: "Movement path",
      note: "Note",
      supplier: "Supplier",
      supplierParts: "Supplier parts",
      description: "Description",
    },
    overview: {
      productCount: "Product count",
      totalStock: "Total stock",
      lowStockPressure: "Low-stock pressure",
      recentMovement: "Recent movement activity",
      loadingData: "Loading live inventory data...",
      sectionTitle: "Warehouse overview",
      sectionDescription:
        "These KPIs come from the warehouse service through app route handlers, not direct browser calls.",
      productsDescription:
        "Mapped part records available to the dashboard product registry.",
      totalStockDescription:
        "All stock quantities across the visible warehouse location tree.",
      lowStockDescription:
        "Products with available quantity at or below the current operator threshold of five.",
      recentMovementDescription:
        "Tracking entries recorded in the last seven days.",
      loadingProducts:
        "Checking how many mapped parts are available to dashboard operators.",
      loadingTotalStock: "Fetching stock rows and location-aware availability.",
      loadingLowStock:
        "Computing low-stock pressure from current product availability.",
      loadingRecentMovement:
        "Reading stock tracking history for the last seven days.",
      fastPathsTitle: "Fast paths",
      fastPathsDescription:
        "Jump directly into the highest-value warehouse surfaces.",
      productRegistryTitle: "Product registry",
      productRegistryDescription:
        "Search mapped parts, categories, and default stock locations.",
      stockOperationsTitle: "Stock operations",
      stockOperationsDescription:
        "Review availability, location context, and narrow warehouse actions.",
      movementAuditTitle: "Movement audit",
      movementAuditDescription:
        "Track recent stock adjustments, transfers, and receipts.",
    },
    empty: {
      noProductsTitle: "No products yet",
      noProductsDescription:
        "No mapped product rows are available from the warehouse service yet.",
      noStockTitle: "No stock available",
      noStockDescription: "No stock rows matched the current filters.",
      noLocationsTitle: "No locations yet",
      noLocationsDescription:
        "No location rows are available from the warehouse service yet.",
      noMovementsTitle: "No movement history yet",
      noMovementsDescription:
        "No stock tracking rows matched the current filters.",
      noSuppliersTitle: "No suppliers yet",
      noSuppliersDescription:
        "No supplier rows are available from the warehouse service yet.",
    },
    planning: {
      moduleShape: "Warehouse module shape",
      moduleShapeDescription:
        "These routes stay stable even when the external warehouse service is unavailable.",
      serviceBoundary: "Service boundary",
      serviceBoundaryDescription:
        "The inventory module stays behind app route handlers even when the service is unavailable.",
      whatStaysTrue: "What stays true",
      whatStaysTrueDescription:
        "The live integration uses the same app shell and route handlers when the service comes back.",
      serviceRequired: "Inventory service required",
      featureFlagOn: "Fallback flag on",
      featureFlagOff: "Fallback flag off",
      truthLineOne:
        "The warehouse backend owns inventory truth, locations, stock items, and supplier references.",
      truthLineTwo:
        "The app shell keeps auth, organizations, memberships, and app-level permissions.",
      truthLineThree:
        "Browser clients continue calling internal route handlers, not the warehouse service directly.",
    },
    products: {
      sectionTitle: "Product registry",
      sectionDescription:
        "Mapped warehouse parts become stable product and SKU rows for operators.",
      loadingTitle: "Products",
      loadingBody:
        "Loading mapped parts and category information from the warehouse service.",
      emptyTitle: "No products found",
      emptyDescription:
        "Try another search or category filter, or verify that the warehouse service has mapped parts.",
    },
    stock: {
      sectionTitle: "Stock visibility",
      sectionDescription:
        "Warehouse operators can inspect quantities, availability, and location context here.",
      loadingTitle: "Stock",
      loadingBody:
        "Loading stock rows, operator-facing quantities, and location metadata.",
      emptyTitle: "No stock rows match the current filters",
      emptyDescription:
        "Try another product, location, or status filter, or confirm that the warehouse service contains stock items.",
      partId: "Part ID {id}",
      destinationMustDiffer:
        "Destination location must be different from the current location.",
      invalidAdjustPayload: "Invalid stock adjustment payload.",
      invalidTransferPayload: "Invalid stock transfer payload.",
      invalidReceivePayload: "Invalid stock receive payload.",
      adjustFailed: "Stock adjustment failed.",
      transferFailed: "Stock transfer failed.",
      receiptFailed: "Stock receipt failed.",
    },
    locations: {
      sectionTitle: "Location hierarchy",
      sectionDescription:
        "The app preserves warehouse path semantics so operators can read the location tree without flattening away context.",
      loadingTitle: "Locations",
      loadingBody:
        "Loading warehouse, zone, shelf, and bin paths from the warehouse service.",
      emptyTitle: "No locations found",
      emptyDescription:
        "Confirm that the warehouse service has stock locations or that the current service token can read them.",
    },
    movements: {
      sectionTitle: "Movement audit",
      sectionDescription:
        "Tracking entries are presented in operator language so warehouse actions stay readable and traceable.",
      loadingTitle: "Movements",
      loadingBody: "Loading stock tracking history from the warehouse service.",
      emptyTitle: "No movement entries found",
      emptyDescription:
        "Try another product or location filter, or confirm that stock tracking entries exist in the warehouse service.",
      toLabel: "to {destination}",
    },
    suppliers: {
      sectionTitle: "Supplier registry",
      sectionDescription:
        "Suppliers stay visible as procurement references without turning phase 1 into a purchasing workflow.",
      loadingTitle: "Suppliers",
      loadingBody: "Loading supplier registry data from the warehouse service.",
      emptyTitle: "No suppliers found",
      emptyDescription:
        "Confirm that supplier companies exist in the warehouse service or that the service token can read them.",
    },
    dialogs: {
      adjustTitle: "Adjust stock",
      adjustDescription:
        "Adjust {productName} at {location}. Positive numbers add stock; negative numbers remove it.",
      adjustChooseItem: "Choose a stock item to adjust.",
      adjustNotePlaceholder:
        "Explain why this stock adjustment is being recorded.",
      adjustQuantityPlaceholder: "-2 or 5",
      transferTitle: "Transfer stock",
      transferDescription:
        "Move {productName} from {location} to another warehouse location.",
      transferChooseItem: "Choose a stock item to transfer.",
      transferNotePlaceholder: "Capture why this transfer is being made.",
      receiveTitle: "Receive stock",
      receiveDescription:
        "Record an inbound stock receipt into an operator-selected destination location.",
      receiveNotePlaceholder: "Capture context for this receipt.",
    },
    viewerRole: {
      owner: "Owner access",
      admin: "Admin access",
      editor: "Editor access",
      viewer: "Viewer access",
      unavailable: "Role unavailable",
    },
    pages: {
      disabledByFlag:
        "Inventory is currently hidden behind the local fallback flag catalog.",
      active: "Inventory is active.",
      overview: {
        title: "Inventory",
        description:
          "Run the inventory module through the dashboard shell while the warehouse service stays the source of truth.",
        card1Title: "Warehouse service boundary",
        card1Description:
          "The warehouse service owns inventory truth while the app keeps auth, shell, and orchestration.",
        card1Item1: "The app remains the user and organization layer",
        card1Item2: "Browser clients keep calling app route handlers only",
        card1Item3: "The warehouse service becomes the separate domain engine",
        card2Title: "Phase 1 module shape",
        card2Description:
          "The live inventory phase focuses on read surfaces and narrow warehouse actions.",
        card2Item1:
          "Product registry, stock visibility, locations, movements, and suppliers",
        card2Item2: "Stock adjust, transfer, and receive actions only",
        card2Item3: "No storefront, pricing, or ERP-style sprawl",
      },
      products: {
        title: "Products",
        description:
          "Browse the product and SKU registry backed by warehouse part data.",
        card1Title: "Registry first",
        card1Description:
          "The app maps warehouse parts into stable product and SKU rows for dashboard operators.",
        card1Item1:
          "Product and part language are normalized in the mapping layer",
        card1Item2: "Search and category filters stay in the app contract",
        card1Item3: "Raw service payloads never reach the browser",
        card2Title: "What phase 1 does not add",
        card2Description:
          "This route is not a storefront catalog and does not take on commerce behavior.",
        card2Item1: "No customer-facing product pages",
        card2Item2: "No pricing or checkout logic",
        card2Item3: "No direct browser access to warehouse service APIs",
      },
      stock: {
        title: "Stock",
        description:
          "Operate the stock visibility surface for quantity, allocation, and location-aware inventory context.",
        card1Title: "Stock visibility",
        card1Description:
          "The stock route is the primary operational table for quantity and location-aware inventory context.",
        card1Item1: "Quantity and availability remain distinct",
        card1Item2: "Location context stays visible in each row",
        card1Item3: "Lot or serial detail is preserved when available",
        card2Title: "Narrow write boundary",
        card2Description:
          "Phase 1 write operations stay deliberately small and warehouse-specific.",
        card2Item1: "Adjust stock with a required note",
        card2Item2: "Transfer stock between locations",
        card2Item3: "Receive stock into a destination location",
      },
      locations: {
        title: "Locations",
        description:
          "Browse the warehouse hierarchy and preserve the location tree without flattening operator context.",
        card1Title: "Hierarchy first",
        card1Description:
          "The app preserves the location tree instead of flattening warehouse structure too early.",
        card1Item1: "Location paths remain visible to operators",
        card1Item2:
          "Warehouse, zone, shelf, and bin context can coexist in one tree",
        card1Item3:
          "Read-only location browsing lands before any editing surface",
        card2Title: "What stays deferred",
        card2Description:
          "Phase 1 keeps location editing and advanced warehouse management out of scope.",
        card2Item1: "No location creation flow in the app yet",
        card2Item2: "No warehouse rules engine in the app",
        card2Item3: "No attempt to replace the warehouse admin UI",
      },
      movements: {
        title: "Movements",
        description:
          "Use the stock movement audit surface to trace warehouse actions without exposing raw service payloads.",
        card1Title: "Operational audit page",
        card1Description:
          "Movement history is the first warehouse audit surface in the dashboard.",
        card1Item1:
          "Stock tracking entries become a readable movement timeline",
        card1Item2: "Filters will focus on product and location first",
        card1Item3:
          "Writes in phase 1 should show up here after successful mutation calls",
        card2Title: "Model translation",
        card2Description:
          "The app must preserve warehouse tracking semantics while presenting them in product-facing language.",
        card2Item1: "Tracking entries become movement rows",
        card2Item2: "Location and part context stay visible",
        card2Item3: "Notes and quantity deltas remain part of the audit trail",
      },
      suppliers: {
        title: "Suppliers",
        description:
          "Browse supplier references without turning phase 1 into a purchasing project.",
        card1Title: "Procurement references only",
        card1Description:
          "The first supplier surface is a reference registry, not a purchasing workflow.",
        card1Item1: "Suppliers and supplier-part links are visible",
        card1Item2:
          "The page supports warehouse context without purchase-order screens",
        card1Item3:
          "Procurement depth remains deferred until inventory basics are proven",
        card2Title: "Service boundary",
        card2Description:
          "Supplier truth remains external to the app in the same way stock truth does.",
        card2Item1: "No local supplier tables in the app for phase 1 truth",
        card2Item2: "The app maps supplier payloads into stable rows",
        card2Item3: "Advanced purchasing stays out of scope",
      },
    },
  },
  dashboardContent: {
    shared: {
      reset: "Reset",
      resetView: "Reset view",
      resetFilters: "Reset filters",
      clearFilters: "Clear filters",
      saveChanges: "Save changes",
      saving: "Saving...",
      saved: "Saved",
      readOnly: "Read only",
      unsavedChanges: "Unsaved changes",
      refreshing: "Refreshing",
      you: "You",
      returnToOverview: "Return to overview",
    },
    overview: {
      title: "Overview",
      description:
        "Registry Studio gives design-system teams one place to manage workspace health, monitor adoption, and review publishing readiness from live workspace data.",
      actions: {
        reviewWorkspaces: "Review workspaces",
        openAdoption: "Open adoption",
        openCreateStudio: "Open create studio",
      },
      snapshotTitle: "Operating snapshot",
      snapshotDescription:
        "Use a compact KPI row to anchor the studio around adoption, release reliability, and workspace health.",
      mvpTitle: "How this MVP is organized",
      mvpDescription:
        "The dashboard is now product-facing, but it still keeps the starter discipline: shared framing in the dashboard layer, product logic in feature slices.",
      ownsTitle: "What the dashboard owns",
      ownsDescription:
        "These are the core operational jobs the current product surface is designed to support.",
      deferredTitle: "What stays intentionally deferred",
      deferredDescription:
        "This product MVP now has a real backend, but it still stays disciplined about scope.",
      stats: {
        activeWorkspaces: "Active workspaces",
        activeTrend: "{count} shipping from the stable channel",
        activeMeta: "Across internal product teams",
        installPulls: "Install pulls",
        installTrend: "{count} preview sessions",
        installMeta: "Last 30 days",
        releaseHealth: "Release health",
        releaseTrend: "{count} failed publishes in the last 7 days",
        releaseMeta: "{count} healthy workspaces",
      },
      ownsItems: {
        one: "Track workspace health, style selection, and release channel coverage.",
        two: "Monitor adoption through install pulls, preview usage, and source breakdowns.",
        three:
          "Keep workspace defaults, publish rules, and alerts in one settings surface.",
        four: "Route product pages through shared dashboard primitives instead of docs-site examples.",
      },
      deferredItems: {
        one: "The shared app backend now covers auth, persistence, access control, and dashboard reads for the MVP.",
        two: "Publishing workflows, approvals, and destructive actions stay placeholder-only in this phase.",
        three:
          "Adoption charts use seeded reporting data, not a production telemetry pipeline yet.",
      },
    },
    workspaces: {
      title: "Workspaces",
      description:
        "Track design-system workspaces, release channels, and install volume from the live Registry Studio dataset.",
      actions: {
        exportInventory: "Export inventory",
        createWorkspace: "Create workspace",
      },
      sections: {
        healthTitle: "Workspace health",
        healthDescription:
          "Use lightweight summary cards to keep adoption, release coverage, and review risk visible as filters change.",
        inventoryTitle: "Workspace registry inventory",
        inventoryDescription:
          "The main operations list keeps search and status controls close to the table while leaving domain logic in the slice.",
      },
      empty: {
        noneTitle: "No workspaces found",
        noneDescription:
          "Create or sync a workspace once the registry backend starts onboarding real product teams.",
        filteredTitle: "No workspaces match the current filters",
        filteredDescription:
          "Try a broader search term or clear one of the active filters.",
      },
      filters: {
        resultCount: "{count} workspace(s) visible",
        searchPlaceholder: "Search workspace, team, email, or style",
        searchAria: "Search workspaces",
        statusPlaceholder: "Status",
        frameworkPlaceholder: "Framework",
        allStatuses: "All statuses",
        allFrameworks: "All frameworks",
      },
      summary: {
        visible: "Visible workspaces",
        visibleTrend: "{count} healthy",
        visibleMeta: "Filtered inventory",
        installs: "Monthly install pulls",
        installsTrend: "{count} syncing",
        installsMeta: "Across visible workspaces",
        review: "Needs review",
        reviewTrend: "Publishing or lint drift",
        reviewMeta: "Review queue",
        stable: "Stable channel",
        stableTrend: "Shipping production-ready styles",
        stableMeta: "Release coverage",
      },
      columns: {
        workspace: "Workspace",
        team: "Team",
        registry: "Registry",
        status: "Status",
        lastRelease: "Last release",
        components: "{count} components",
        channel: "{channel} channel",
        installPulls: "{count} install pulls",
      },
      statuses: {
        healthy: "Healthy",
        syncing: "Syncing",
        needsReview: "Needs review",
      },
      frameworks: {
        nextjs: "Next.js",
        vite: "Vite",
        monorepo: "Monorepo",
      },
      releaseChannels: {
        stable: "Stable",
        beta: "Beta",
        canary: "Canary",
      },
      loading: {
        description:
          "Loading workspace health, publish status, and registry inventory.",
        healthDescription:
          "Summary metrics stay in place while the inventory loads.",
        inventoryDescription:
          "The table skeleton mirrors the final list structure.",
      },
    },
    adoption: {
      title: "Adoption overview",
      description:
        "Track install activity, preview usage, and registry adoption signals through workspace reporting snapshots.",
      actions: {
        shareReport: "Share report",
        exportCsv: "Export CSV",
      },
      alert: {
        refreshFailed: "Could not refresh the report",
      },
      filters: {
        refreshingReport: "Refreshing report",
        liveWorkspaceSnapshot: "Live workspace snapshot",
        helper: "Range and compare controls re-query the adoption RPC",
        selectRange: "Select range",
        compareAgainst: "Compare against",
        last30Days: "Last 30 days",
        last90Days: "Last 90 days",
        last12Months: "Last 12 months",
        comparePrevious: "vs previous period",
        compareYear: "vs last year",
      },
      sections: {
        snapshotTitle: "Adoption snapshot",
        snapshotDescription:
          "Lead with install, workspace, and release metrics before moving into chart-level detail.",
        reportingTitle: "Adoption reporting",
        reportingDescription:
          "Pair one primary usage chart with a supporting breakdown so the page stays readable.",
        signalsTitle: "Product signals",
        signalsDescription:
          "Breakdown rows help the reporting page add context without overloading the chart area.",
      },
      cards: {
        installsAndPreviews: "Install pulls and preview sessions",
        installsAndPreviewsDescription:
          "Compare recurring install activity against preview usage for the selected reporting window.",
        noTrendTitle: "No adoption trend data",
        noTrendDescription:
          "This reporting window does not have install or preview activity yet.",
        comparePrevious: "Comparison mode: previous period",
        compareYear: "Comparison mode: same period last year",
        bySurface: "Adoption by surface",
        bySurfaceDescription:
          "Use a compact supporting chart to show where registry activity is concentrated.",
        noBreakdownTitle: "No source breakdown data",
        noBreakdownDescription:
          "This reporting period has no surface-level usage yet.",
        relativeUsage:
          "Usage is shown as relative install volume in thousands.",
        readout: "Operational readout",
        readoutDescription:
          "Keep supporting insights concise, scannable, and tied to the same reporting window.",
        noInsightsTitle: "No supporting insights",
        noInsightsDescription:
          "Use a lightweight no-data state when summary signals are unavailable.",
      },
      metrics: {
        installPulls: "Install pulls",
        activeWorkspaces: "Active workspaces",
        publishSuccess: "Publish success",
        previewSessions: "Preview sessions",
        installsMeta: "CLI and docs installs",
        workspacesMeta: "Touched the registry this period",
        publishMeta: "Release and preview jobs",
        previewsMeta: "Create studio and shared previews",
        usage: "Usage",
        noChange: "No change",
        newActivity: "New activity",
        pts: "{value} pts",
        workspacesDelta: "{value} workspaces",
      },
      loading: {
        description:
          "Loading install activity, preview usage, and reporting blocks.",
        snapshotDescription:
          "KPI cards keep their final shape while reporting data loads.",
        reportingDescription:
          "Primary and supporting charts mirror the final reporting hierarchy.",
        signalsDescription:
          "Breakdown rows keep the same rhythm as the final report view.",
      },
    },
    settings: {
      nav: {
        workspace: "Workspace settings",
        members: "Members",
      },
      page: {
        title: "Workspace settings",
        description:
          "Manage registry defaults, publish rules, and operational controls with persisted organization settings.",
      },
      badges: {
        readOnly: "Read only",
        unsavedChanges: "Unsaved changes",
        saved: "Saved",
      },
      alerts: {
        viewerTitle: "Viewer access",
        viewerDescription:
          "You can review workspace settings, but only owners, admins, and editors can change them.",
        fieldsNeedAttention: "{count} field(s) need attention",
        fieldsNeedAttentionDescription:
          "Review the highlighted inputs before saving this workspace configuration.",
        savedTitle: "Settings saved",
        saveFailedTitle: "Save failed",
      },
      sections: {
        profileTitle: "Workspace profile",
        profileDescription:
          "Group stable identity and delivery defaults into predictable sections.",
        identityTitle: "Identity",
        identityDescription:
          "Use this section for the high-signal workspace metadata that appears across publishing and reporting surfaces.",
        deliveryTitle: "Delivery defaults",
        deliveryDescription:
          "These defaults stay reusable across future workspace-level settings pages.",
        accessTitle: "Access and publishing",
        accessDescription:
          "Use grouped switches and policy controls to keep settings pages readable as they grow.",
        notificationsTitle: "Notification rules",
        notificationsDescription:
          "These toggles model repeatable horizontal field rows with helper text.",
        notificationsFooter:
          "Notification preferences are now persisted in organization settings.",
        publishingTitle: "Publishing controls",
        publishingDescription:
          "Use this section for workspace-level controls that will later inform auth, review, and release workflows.",
        adminActionsTitle: "Administrative actions",
        dangerTitle: "Danger zone",
        dangerDescription:
          "Keep destructive actions visibly separate from editable settings even when the real workflow is not implemented yet.",
      },
      fields: {
        workspaceName: "Workspace name",
        workspaceNameDescription:
          "This name appears in the dashboard, exports, and release notifications.",
        adminEmail: "Admin email",
        adminEmailDescription:
          "Use a monitored inbox for publish failures and operational alerts.",
        registryUrl: "Registry URL",
        registryUrlDescription:
          "Keep a canonical workspace URL so future workflows can link directly into preview and release surfaces.",
        workspaceSummary: "Workspace summary",
        workspaceSummaryDescription:
          "Keep this short enough to reuse in admin readouts and compact overview cards.",
        defaultStyle: "Default style",
        defaultStyleDescription:
          "Use the same design-system vocabulary that appears in workspace inventory and adoption reporting.",
        targetFramework: "Target framework",
        targetFrameworkDescription:
          "This demonstrates a reusable framework/default selection pattern for future product settings.",
        previewLinkExpiry: "Preview link expiry",
        previewLinkExpiryDescription:
          "Keep preview retention explicit so future links and review tools can map to it cleanly.",
        publishingMode: "Publishing mode",
        publishingModeDescription:
          "This demonstrates a reusable radio-group pattern for policy-style settings.",
        organizationId: "Organization ID",
        organizationIdDescription:
          "Read-only identifiers help future settings pages mix editable and fixed metadata without new layout patterns.",
      },
      options: {
        selectStyle: "Select style",
        selectFramework: "Select framework",
        selectExpiry: "Select expiry",
        stablePublishing: "Stable-first publishing",
        stablePublishingDescription:
          "Keep docs and previews centered on reviewed releases and production-ready components.",
        previewWorkflow: "Preview-friendly workflow",
        previewWorkflowDescription:
          "Surface beta and canary changes earlier so teams can validate design-system updates faster.",
        manualExport: "Manual export",
      },
      toggles: {
        publishDigest: "Publish digest",
        publishDigestDescription:
          "Send a weekly release summary to workspace owners and maintainers.",
        releaseAlerts: "Release alerts",
        releaseAlertsDescription:
          "Notify admins when stable or beta publishes fail, stall, or need review.",
        previewSyncAlerts: "Preview sync alerts",
        previewSyncAlertsDescription:
          "Escalate preview build failures and stale snapshot warnings immediately.",
        changelogAnnouncements: "Changelog announcements",
        changelogAnnouncementsDescription:
          "Keep release-note announcements optional so operational pages stay focused.",
        allowEditorInvites: "Allow editor invites",
        allowEditorInvitesDescription:
          "Let workspace leads add maintainers without leaving the dashboard.",
        requireReview: "Require review before publish",
        requireReviewDescription:
          "Keep high-impact release changes gated until richer approval workflows exist.",
        enforceSso: "Enforce SSO when available",
        enforceSsoDescription:
          "This policy is persisted now, even though enterprise SSO itself stays a later phase.",
      },
      actions: {
        rotatePreviewLinks: "Rotate preview links",
        pauseWorkspace: "Pause workspace",
      },
      errors: {
        workspaceNameRequired: "Workspace name is required.",
        workspaceNameShort: "Use a name with at least 3 characters.",
        adminEmailRequired: "Admin email is required.",
        adminEmailInvalid: "Enter a valid admin email address.",
        registryUrlRequired: "Registry URL is required.",
        registryUrlInvalid: "Registry URL must start with http:// or https://.",
        summaryTooLong: "Keep the summary under 200 characters.",
      },
    },
    members: {
      page: {
        title: "Members",
        description:
          "Manage organization access, invitations, and role visibility without leaving the settings surface.",
      },
      accessBadge: "{role} access",
      alerts: {
        readOnlyTitle: "Read-only member visibility",
        readOnlyDescription:
          "You can review who belongs to {organization}, but only owners and admins can invite people or change access.",
        actionFailed: "Action failed",
        actionCompleted: "Action completed",
      },
      sections: {
        inviteTitle: "Invite teammates",
        inviteDescription:
          "Send invite-only access with the role they should receive after sign-in.",
        sendInvitationTitle: "Send invitation",
        sendInvitationDescription:
          "Invites create a pending org assignment and send a sign-in link email.",
        currentMembersTitle: "Current members",
        currentMembersDescription:
          "Keep role visibility and membership health close to the rest of the product configuration.",
        orgAccessTitle: "Organization access",
        orgAccessDescription:
          "Members are ordered by access level so the current ownership model stays obvious.",
        pendingInvitesTitle: "Pending invitations",
        pendingInvitesDescription:
          "Track onboarding state without leaving the settings workflow.",
        invitationQueueTitle: "Invitation queue",
        invitationQueueDescription:
          "Pending invites stay visible until they are accepted, revoked, or expire.",
      },
      fields: {
        emailAddress: "Email address",
        role: "Role",
      },
      actions: {
        sending: "Sending...",
        sendInvite: "Send invite",
        updateRole: "Update role",
        remove: "Remove",
        revoke: "Revoke",
      },
      messages: {
        inviteHint:
          "New invites default to a 7-day expiry window and are accepted automatically after the invited user signs in.",
        ownerLocked: "Owner access is locked in this phase.",
        joined: "Joined {date}",
        invited: "Invited {date}",
        expires: "Expires {date}",
        noMembersTitle: "No members found",
        noMembersDescription:
          "Organization access will appear here once people start using the dashboard.",
        noInvitesTitle: "No pending invites",
        noInvitesDescription:
          "New invitations will appear here until the recipient signs in or the invite is revoked.",
        invalidInvite:
          "Enter a valid email address and role before sending an invitation.",
        inviteFailed: "Could not send the invitation.",
        inviteSent: "Invitation sent.",
        updateFailed: "Could not update the member role.",
        updateSuccess: "Member role updated.",
        removeConfirm: "Remove {email} from {organization}?",
        removeFailed: "Could not remove the member.",
        removeSuccess: "Member removed.",
        revokeConfirm: "Revoke the invitation for {email}?",
        revokeFailed: "Could not revoke the invitation.",
        revokeSuccess: "Invitation revoked.",
      },
      roles: {
        owner: "Owner",
        admin: "Admin",
        editor: "Editor",
        viewer: "Viewer",
      },
      invitationStatus: {
        accepted: "Accepted",
        expired: "Expired",
        revoked: "Revoked",
        pending: "Pending",
      },
    },
  },
} as const

export default enMessages
