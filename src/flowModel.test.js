import test from "node:test";
import assert from "node:assert/strict";
import { GATES, gateProgress, getGateBlockers, makeInitialProject, taskBlockers } from "./flowModel.js";

test("an empty project cannot pass the handoff gate", () => {
  const project = makeInitialProject();
  const blockers = getGateBlockers(project, 0);
  assert.ok(blockers.includes("Project type is missing"));
  assert.ok(blockers.some((item) => item.includes("status must be Complete or N/A")));
  assert.ok(blockers.includes("Landlord or site permission requirement has not been answered"));
});

test("complete work requires an evidence link and due date", () => {
  const project = makeInitialProject();
  project.tasks["crm-number"] = {
    ...project.tasks["crm-number"],
    status: "Complete",
    owner: "Nathan"
  };
  assert.deepEqual(taskBlockers(project, "crm-number"), [
    "CRM record and four-digit project number confirmed: evidence link is missing",
    "CRM record and four-digit project number confirmed: due date is missing"
  ]);
});

test("plain text does not satisfy an evidence-link requirement", () => {
  const project = makeInitialProject();
  project.tasks["crm-number"] = {
    ...project.tasks["crm-number"],
    status: "Complete",
    owner: "Nathan",
    dueDate: "2026-08-19",
    evidence: "already done"
  };
  assert.deepEqual(taskBlockers(project, "crm-number"), [
    "CRM record and four-digit project number confirmed: evidence must be a working web link"
  ]);
  assert.deepEqual(gateProgress(project, 0), { completed: 0, total: 6 });
});

test("N/A work requires a reason but not an evidence link", () => {
  const project = makeInitialProject();
  project.tasks["site-permission"] = {
    ...project.tasks["site-permission"],
    status: "N/A",
    owner: "Nathan",
    note: "Landlord permission is not required for this site."
  };
  assert.deepEqual(taskBlockers(project, "site-permission"), []);
});

test("gate order remains handoff, kickoff, return, closeout", () => {
  assert.deepEqual(
    GATES.map((gate) => gate.id),
    ["handoff", "kickoff", "return", "closeout"]
  );
});
