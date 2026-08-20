export const STATUS_OPTIONS = [
  "Not started",
  "In progress",
  "Waiting",
  "Blocked",
  "Complete",
  "N/A"
];

export const OWNER_OPTIONS = [
  "Unassigned",
  "Nathan",
  "Chris",
  "JC",
  "Jose",
  "Shiloh",
  "Michael",
  "Dylan",
  "Ricky",
  "Don"
];

export const QUICK_REFERENCE_FIELDS = [
  { key: "projectType", label: "Project type", placeholder: "PPA, direct purchase, EPC-only..." },
  { key: "agreementType", label: "Agreement type", placeholder: "PPA, EPC agreement, LOI..." },
  { key: "systemSize", label: "System size", placeholder: "Approved kW / MW basis" },
  { key: "approvedModel", label: "Approved financial model", placeholder: "Paste the controlling model link" },
  { key: "epcPath", label: "EPC path", placeholder: "Selected EPC or current selection path" },
  { key: "ownerBuyerPath", label: "Owner / buyer path", placeholder: "Current owner, buyer, or selection path" },
  { key: "nextAction", label: "Next action", placeholder: "One exact next move" },
  { key: "nextActionOwner", label: "Next-action owner", placeholder: "Person accountable for the next move" },
  { key: "nextActionDate", label: "Next-action date", type: "date" },
  { key: "requiredDocs", label: "Required documents", placeholder: "List the documents this project requires", multiline: true },
  { key: "receivedDocs", label: "Received documents", placeholder: "List what is already controlled in Drive", multiline: true },
  { key: "missingDocs", label: "Missing documents", placeholder: "Use None if the package is complete", multiline: true }
];

export const LINK_FIELDS = [
  { key: "crmUrl", label: "CRM deal" },
  { key: "driveUrl", label: "Drive source folder" },
  { key: "slackUrl", label: "Slack project channel" },
  { key: "zohoProjectUrl", label: "Zoho Project" }
];

const URL_FIELD_KEYS = new Set(["approvedModel", ...LINK_FIELDS.map((field) => field.key)]);

function isWebLink(value) {
  return /^https?:\/\//i.test(String(value || "").trim());
}

export const GATES = [
  {
    id: "handoff",
    number: "01",
    label: "Sales handoff",
    owner: "Nathan / CRM owner",
    purpose: "Make the project executable without rebuilding facts from email, Slack, or memory.",
    requiredFields: [
      "projectType",
      "agreementType",
      "systemSize",
      "approvedModel",
      "epcPath",
      "ownerBuyerPath",
      "nextAction",
      "nextActionOwner",
      "nextActionDate",
      "requiredDocs",
      "receivedDocs",
      "missingDocs",
      "crmUrl",
      "driveUrl"
    ],
    taskIds: [
      "crm-number",
      "drive-match",
      "controlling-docs",
      "current-model",
      "open-items",
      "landlord-answer"
    ]
  },
  {
    id: "kickoff",
    number: "02",
    label: "Execution kickoff",
    owner: "Execution lead + gate reviewer",
    purpose: "Review a complete execution plan; kickoff is not a discovery meeting.",
    requiredFields: ["zohoProjectUrl", "slackUrl"],
    taskIds: [
      "template-created",
      "owners-set",
      "dates-set",
      "parallel-opened",
      "dependencies-set",
      "kickoff-review"
    ]
  },
  {
    id: "return",
    number: "03",
    label: "Execution return",
    owner: "Execution lead",
    purpose: "Return a current, evidence-backed answer to CRM—not a loose collection of updates.",
    requiredFields: [],
    taskIds: [
      "epc-contract",
      "design-validation",
      "financial-validation",
      "buyer-path",
      "site-permission",
      "utility-path",
      "source-control",
      "return-summary"
    ]
  },
  {
    id: "closeout",
    number: "04",
    label: "CRM closeout",
    owner: "Nathan / CRM owner",
    purpose: "Write the final operating truth and the next accountable move back into CRM.",
    requiredFields: ["nextAction", "nextActionOwner", "nextActionDate"],
    taskIds: ["crm-current", "drive-final", "final-decision"]
  }
];

export const TASKS = [
  {
    id: "crm-number",
    gateId: "handoff",
    title: "CRM record and four-digit project number confirmed",
    detail: "The deal name and project number match the working project.",
    lane: "Control"
  },
  {
    id: "drive-match",
    gateId: "handoff",
    title: "Drive source folder matches the CRM project",
    detail: "The folder is linked and is the controlling location for project files.",
    lane: "Control"
  },
  {
    id: "controlling-docs",
    gateId: "handoff",
    title: "Controlling agreements identified",
    detail: "Current PPA, EPC agreement, LOI, CLA, or other controlling document is named and linked.",
    lane: "Commercial"
  },
  {
    id: "current-model",
    gateId: "handoff",
    title: "Approved model and design basis identified",
    detail: "The team can tell which financial model, size, and design basis controls execution.",
    lane: "Technical"
  },
  {
    id: "open-items",
    gateId: "handoff",
    title: "Open items have an owner and date",
    detail: "Every known gap has one accountable owner and one next-action date.",
    lane: "Control"
  },
  {
    id: "landlord-answer",
    gateId: "handoff",
    title: "Landlord or site permission requirement answered",
    detail: "Select Required or Not required in the branch question below; do not leave this assumed.",
    lane: "Site"
  },
  {
    id: "template-created",
    gateId: "kickoff",
    title: "Zoho Project created from the standard template",
    detail: "The execution record is linked to the CRM deal and Drive folder.",
    lane: "Control"
  },
  {
    id: "owners-set",
    gateId: "kickoff",
    title: "Every applicable execution task has an owner",
    detail: "No task needed for the build remains unassigned.",
    lane: "Control"
  },
  {
    id: "dates-set",
    gateId: "kickoff",
    title: "Deadlines and review dates are set",
    detail: "Approval tasks include the original deadline and a review date if rejected.",
    lane: "Control"
  },
  {
    id: "parallel-opened",
    gateId: "kickoff",
    title: "All work that can start now is open",
    detail: "EPC, design, finance, buyer, and site work are not waiting on an unrelated gate.",
    lane: "Control"
  },
  {
    id: "dependencies-set",
    gateId: "kickoff",
    title: "True dependencies and approval gates are defined",
    detail: "Only work that genuinely requires an upstream answer is blocked.",
    lane: "Control"
  },
  {
    id: "kickoff-review",
    gateId: "kickoff",
    title: "Execution plan reviewed at kickoff",
    detail: "The kickoff confirms the completed plan, owners, deadlines, dependencies, and open risks.",
    lane: "Control"
  },
  {
    id: "epc-contract",
    gateId: "return",
    title: "EPC scope, price, agreement, and schedule resolved",
    detail: "Negotiation status and controlling agreement are current.",
    lane: "EPC / Contract"
  },
  {
    id: "design-validation",
    gateId: "return",
    title: "Design and production basis validated",
    detail: "System size, layout, production, equipment, and constraints have an approved answer.",
    lane: "Design / Engineering"
  },
  {
    id: "financial-validation",
    gateId: "return",
    title: "Financial model and funding path validated",
    detail: "PPA economics, CLA/draw/cash, tax, and entity inputs are current.",
    lane: "Finance"
  },
  {
    id: "buyer-path",
    gateId: "return",
    title: "Buyer or system-owner path confirmed",
    detail: "Current buyer, backup path, package, and next outreach are visible.",
    lane: "Buyer / Owner"
  },
  {
    id: "site-permission",
    gateId: "return",
    title: "Landlord or site permission completed",
    detail: "Required permission is evidenced, or the task is marked N/A with the reason.",
    lane: "Site"
  },
  {
    id: "utility-path",
    gateId: "return",
    title: "Utility, interconnection, and permitting path current",
    detail: "Known requirements, submissions, approvals, and blockers are documented.",
    lane: "Site"
  },
  {
    id: "source-control",
    gateId: "return",
    title: "Decisions and source files captured",
    detail: "Useful email, Slack, portal, and meeting evidence is saved or linked to the project.",
    lane: "Control"
  },
  {
    id: "return-summary",
    gateId: "return",
    title: "Execution return summary prepared",
    detail: "Ready, blocked, approved, rejected, and next CRM action are stated plainly.",
    lane: "Control"
  },
  {
    id: "crm-current",
    gateId: "closeout",
    title: "CRM stage, status, owner, blocker, and next action updated",
    detail: "The CRM record is the current operating truth.",
    lane: "Closeout"
  },
  {
    id: "drive-final",
    gateId: "closeout",
    title: "Final documents and decisions saved in Drive",
    detail: "The controlling files are present and the links work.",
    lane: "Closeout"
  },
  {
    id: "final-decision",
    gateId: "closeout",
    title: "Final disposition recorded",
    detail: "Close, keep open with owner/date, or escalate to a named decision-maker.",
    lane: "Closeout"
  }
];

export function makeInitialProject() {
  return {
    projectId: "0199",
    projectName: "McCarty",
    stageIndex: 0,
    updatedAt: new Date().toISOString(),
    quickReference: Object.fromEntries(
      [...QUICK_REFERENCE_FIELDS, ...LINK_FIELDS].map((field) => [field.key, ""])
    ),
    landlordPermission: "Unknown",
    tasks: Object.fromEntries(
      TASKS.map((task) => [
        task.id,
        {
          status: "Not started",
          owner: "Unassigned",
          dueDate: "",
          evidence: "",
          note: ""
        }
      ])
    ),
    gateReviews: {},
    activity: [
      {
        at: new Date().toISOString(),
        text: "0199 working shell created from the standardized handoff template."
      }
    ]
  };
}

export function taskBlockers(project, taskId) {
  const task = TASKS.find((item) => item.id === taskId);
  const record = project.tasks[taskId];
  const blockers = [];

  if (!record || !["Complete", "N/A"].includes(record.status)) {
    blockers.push(`${task.title}: status must be Complete or N/A`);
    return blockers;
  }

  if (record.owner === "Unassigned") {
    blockers.push(`${task.title}: owner is missing`);
  }

  if (record.status === "Complete" && !record.evidence.trim()) {
    blockers.push(`${task.title}: evidence link is missing`);
  }

  if (record.status === "Complete" && record.evidence.trim() && !isWebLink(record.evidence)) {
    blockers.push(`${task.title}: evidence must be a working web link`);
  }

  if (record.status === "Complete" && !record.dueDate) {
    blockers.push(`${task.title}: due date is missing`);
  }

  if (record.status === "N/A" && !record.note.trim()) {
    blockers.push(`${task.title}: N/A reason is missing`);
  }

  return blockers;
}

export function getGateBlockers(project, gateIndex = project.stageIndex) {
  const gate = GATES[gateIndex];
  if (!gate) return [];
  const labels = Object.fromEntries(
    [...QUICK_REFERENCE_FIELDS, ...LINK_FIELDS].map((field) => [field.key, field.label])
  );
  const blockers = gate.requiredFields
    .filter((key) => !String(project.quickReference[key] || "").trim())
    .map((key) => `${labels[key]} is missing`);

  gate.requiredFields
    .filter((key) => URL_FIELD_KEYS.has(key))
    .filter((key) => project.quickReference[key] && !isWebLink(project.quickReference[key]))
    .forEach((key) => blockers.push(`${labels[key]} must be a working web link`));

  if (gate.id === "handoff" && project.landlordPermission === "Unknown") {
    blockers.push("Landlord or site permission requirement has not been answered");
  }

  gate.taskIds.forEach((taskId) => blockers.push(...taskBlockers(project, taskId)));

  if (!project.gateReviews[gate.id]?.reviewer) {
    blockers.push(`${gate.label}: gate reviewer is missing`);
  }

  return blockers;
}

export function gateProgress(project, gateIndex) {
  const gate = GATES[gateIndex];
  const completed = gate.taskIds.filter((taskId) => taskBlockers(project, taskId).length === 0).length;
  return { completed, total: gate.taskIds.length };
}

export function buildZohoPacket(project) {
  return {
    template: "Soltaic post-PPA execution and handoff",
    generatedAt: new Date().toISOString(),
    project: {
      id: project.projectId,
      name: project.projectName,
      currentGate: GATES[project.stageIndex]?.label || "Complete",
      quickReference: project.quickReference,
      landlordPermission: project.landlordPermission
    },
    gates: GATES.map((gate, index) => ({
      id: gate.id,
      label: gate.label,
      state:
        index < project.stageIndex
          ? "Passed"
          : index === project.stageIndex
            ? "Current"
            : "Upcoming",
      review: project.gateReviews[gate.id] || null,
      tasks: gate.taskIds.map((taskId) => ({
        ...TASKS.find((task) => task.id === taskId),
        ...project.tasks[taskId]
      }))
    }))
  };
}
