import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Ban,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  ClipboardCheck,
  Copy,
  Download,
  ExternalLink,
  GitBranch,
  Link2,
  LockKeyhole,
  RefreshCcw,
  Save,
  ShieldAlert,
  X
} from "lucide-react";
import {
  GATES,
  LINK_FIELDS,
  OWNER_OPTIONS,
  QUICK_REFERENCE_FIELDS,
  STATUS_OPTIONS,
  TASKS,
  buildZohoPacket,
  gateProgress,
  getGateBlockers,
  makeInitialProject
} from "./flowModel.js";
import "./styles.css";

const STORAGE_KEY = "soltaic-project-gate-controller-v1";

function loadProject() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return makeInitialProject();
    const parsed = JSON.parse(saved);
    const blank = makeInitialProject();
    return {
      ...blank,
      ...parsed,
      quickReference: { ...blank.quickReference, ...parsed.quickReference },
      tasks: { ...blank.tasks, ...parsed.tasks },
      gateReviews: parsed.gateReviews || {},
      activity: parsed.activity || blank.activity
    };
  } catch {
    return makeInitialProject();
  }
}

function formatDate(value) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function statusClass(status) {
  return status.toLowerCase().replaceAll(" ", "-").replaceAll("/", "-");
}

function TextField({ field, value, onChange }) {
  const Component = field.multiline ? "textarea" : "input";
  return (
    <label className={`field ${field.multiline ? "wide" : ""}`}>
      <span>{field.label}</span>
      <Component
        type={field.type || "text"}
        value={value}
        placeholder={field.placeholder}
        rows={field.multiline ? 3 : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function GateRail({ project, onSelect }) {
  return (
    <nav className="gate-rail" aria-label="Project gates">
      {GATES.map((gate, index) => {
        const progress = gateProgress(project, index);
        const isPassed = index < project.stageIndex;
        const isCurrent = index === project.stageIndex;
        const isLocked = index > project.stageIndex;
        return (
          <React.Fragment key={gate.id}>
            <button
              className={`gate-step ${isPassed ? "passed" : ""} ${isCurrent ? "current" : ""}`}
              onClick={() => onSelect(index)}
            >
              <span className="gate-step-number">
                {isPassed ? <Check size={17} /> : isLocked ? <LockKeyhole size={14} /> : gate.number}
              </span>
              <span>
                <strong>{gate.label}</strong>
                <small>{isPassed ? "Passed" : `${progress.completed}/${progress.total} checks complete`}</small>
              </span>
            </button>
            {index < GATES.length - 1 && <ArrowRight className="rail-arrow" size={18} />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

function TaskRow({ task, record, onChange }) {
  const [expanded, setExpanded] = useState(false);
  const needsEvidence = record.status === "Complete" && !record.evidence.trim();
  const needsDate = record.status === "Complete" && !record.dueDate;
  const needsReason = record.status === "N/A" && !record.note.trim();
  const ready = ["Complete", "N/A"].includes(record.status) && !needsEvidence && !needsDate && !needsReason && record.owner !== "Unassigned";

  return (
    <article className={`task-row ${expanded ? "expanded" : ""}`}>
      <button className="task-summary" onClick={() => setExpanded((current) => !current)}>
        <span className={`task-state ${ready ? "ready" : statusClass(record.status)}`}>
          {ready ? <CheckCircle2 size={19} /> : <CircleDot size={19} />}
        </span>
        <span className="task-copy">
          <strong>{task.title}</strong>
          <small>{task.detail}</small>
        </span>
        <span className="lane-tag">{task.lane}</span>
        <ChevronDown className="expand-icon" size={19} />
      </button>
      {expanded && (
        <div className="task-controls">
          <label>
            <span>Status</span>
            <select value={record.status} onChange={(event) => onChange("status", event.target.value)}>
              {STATUS_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label>
            <span>Owner</span>
            <select value={record.owner} onChange={(event) => onChange("owner", event.target.value)}>
              {OWNER_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label>
            <span>Due date</span>
            <input type="date" value={record.dueDate} onChange={(event) => onChange("dueDate", event.target.value)} />
          </label>
          <label className="evidence-field">
            <span>Evidence link {record.status === "Complete" && <em>required to pass</em>}</span>
            <input
              type="url"
              value={record.evidence}
              placeholder="CRM, Drive, Zoho, Slack, email, or source record"
              onChange={(event) => onChange("evidence", event.target.value)}
            />
          </label>
          <label className="note-field">
            <span>Blocker, decision, or N/A reason</span>
            <textarea
              rows="2"
              value={record.note}
              placeholder="State the exact answer needed; do not restate the task."
              onChange={(event) => onChange("note", event.target.value)}
            />
          </label>
          {(needsEvidence || needsDate || needsReason) && (
            <p className="inline-warning">
              <AlertTriangle size={15} />
              {needsEvidence
                ? "Complete requires a supporting link."
                : needsDate
                  ? "Complete requires a due date."
                  : "N/A requires a reason."}
            </p>
          )}
        </div>
      )}
    </article>
  );
}

function MissingModal({ gate, blockers, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="blocker-modal" role="dialog" aria-modal="true" aria-label="Gate is blocked" onClick={(event) => event.stopPropagation()}>
        <button className="icon-button close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        <div className="modal-symbol blocked"><Ban size={30} /></div>
        <p className="eyebrow">Hard stop</p>
        <h2>{gate.label} cannot pass yet.</h2>
        <p>Fix the items below. The next gate will not open until every required fact, task, owner, and evidence record is present.</p>
        <ol className="blocker-list">
          {blockers.map((blocker) => <li key={blocker}>{blocker}</li>)}
        </ol>
        <button className="primary-button" onClick={onClose}>Return to missing items</button>
      </section>
    </div>
  );
}

function ProcessMap() {
  const lanes = [
    ["CRM intake", "Clean sales facts and assign the four-digit project number."],
    ["Handoff gate", "Validate the quick reference, sources, open items, and permission branches."],
    ["Execution kickoff", "Review the complete plan, owners, dates, dependencies, and risks."],
    ["Parallel execution", "EPC, design, finance, buyer, and site work start as soon as each can start."],
    ["Return gate", "Execution returns one current answer with supporting evidence."],
    ["CRM closeout", "Write the decision and next accountable move back to CRM."]
  ];
  return (
    <section className="map-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Standard operating path</p>
          <h2>The flow is fixed. Project facts and applicable branches change.</h2>
        </div>
      </div>
      <div className="process-map">
        {lanes.map(([title, detail], index) => (
          <React.Fragment key={title}>
            <article>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{title}</strong>
              <p>{detail}</p>
            </article>
            {index < lanes.length - 1 && <ArrowRight size={20} />}
          </React.Fragment>
        ))}
      </div>
      <div className="parallel-explainer">
        <GitBranch size={28} />
        <div>
          <strong>Parallel does not mean optional.</strong>
          <p>These lanes open immediately when their inputs exist. A lane waits only on its own true dependency, not on unrelated work elsewhere in the project.</p>
        </div>
        <div className="parallel-chips">
          <span>EPC / Contract</span><span>Design / Engineering</span><span>Finance</span><span>Buyer / Owner</span><span>Site</span>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [project, setProject] = useState(loadProject);
  const [selectedGate, setSelectedGate] = useState(project.stageIndex);
  const [activeTab, setActiveTab] = useState("control");
  const [showBlockers, setShowBlockers] = useState(false);
  const [copyState, setCopyState] = useState("Copy Zoho packet");
  const gate = GATES[selectedGate];
  const blockers = useMemo(() => getGateBlockers(project, project.stageIndex), [project]);
  const selectedBlockers = useMemo(() => getGateBlockers(project, selectedGate), [project, selectedGate]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }, [project]);

  function mutateProject(updater) {
    setProject((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      return { ...next, updatedAt: new Date().toISOString() };
    });
  }

  function updateQuickReference(key, value) {
    mutateProject((current) => ({
      ...current,
      quickReference: { ...current.quickReference, [key]: value }
    }));
  }

  function updateTask(taskId, key, value) {
    mutateProject((current) => ({
      ...current,
      tasks: {
        ...current.tasks,
        [taskId]: { ...current.tasks[taskId], [key]: value }
      }
    }));
  }

  function attemptAdvance() {
    if (blockers.length) {
      setShowBlockers(true);
      return;
    }
    const passedGate = GATES[project.stageIndex];
    const nextIndex = Math.min(project.stageIndex + 1, GATES.length);
    mutateProject((current) => ({
      ...current,
      stageIndex: nextIndex,
      gateReviews: {
        ...current.gateReviews,
        [passedGate.id]: { ...current.gateReviews[passedGate.id], approvedAt: new Date().toISOString() }
      },
      activity: [
        { at: new Date().toISOString(), text: `${passedGate.label} passed by ${current.gateReviews[passedGate.id].reviewer}.` },
        ...current.activity
      ]
    }));
    setSelectedGate(Math.min(nextIndex, GATES.length - 1));
  }

  function exportPacket() {
    const payload = JSON.stringify(buildZohoPacket(project), null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${project.projectId || "project"}-zoho-handoff.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function copyPacket() {
    await navigator.clipboard.writeText(JSON.stringify(buildZohoPacket(project), null, 2));
    setCopyState("Copied");
    window.setTimeout(() => setCopyState("Copy Zoho packet"), 1600);
  }

  function resetPrototype() {
    if (!window.confirm("Reset the 0199 prototype and remove all locally entered data from this browser?")) return;
    const blank = makeInitialProject();
    setProject(blank);
    setSelectedGate(0);
  }

  const gateTasks = gate.taskIds.map((id) => TASKS.find((task) => task.id === id));
  const currentProgress = project.stageIndex < GATES.length ? gateProgress(project, project.stageIndex) : { completed: 0, total: 0 };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><ClipboardCheck size={25} /></div>
          <div>
            <p>Soltaic project controls</p>
            <h1>Handoff & execution gate</h1>
          </div>
        </div>
        <div className="project-identity">
          <label>
            <span>Project</span>
            <input value={project.projectId} onChange={(event) => mutateProject((current) => ({ ...current, projectId: event.target.value }))} />
          </label>
          <label>
            <span>Name</span>
            <input value={project.projectName} onChange={(event) => mutateProject((current) => ({ ...current, projectName: event.target.value }))} />
          </label>
          <div className="save-state"><Save size={15} /> Saved in this browser<br /><small>{formatDate(project.updatedAt)}</small></div>
        </div>
      </header>

      <div className="workspace">
        <div className="tab-row">
          <button className={activeTab === "control" ? "active" : ""} onClick={() => setActiveTab("control")}><ShieldAlert size={17} /> Project control</button>
          <button className={activeTab === "map" ? "active" : ""} onClick={() => setActiveTab("map")}><GitBranch size={17} /> Process map</button>
          <span className="prototype-note">Working prototype · no Zoho writes occur from this page</span>
        </div>

        {activeTab === "map" ? <ProcessMap /> : (
          <>
            <GateRail project={project} onSelect={setSelectedGate} />
            <div className="control-layout">
              <div className="main-column">
                <section className="panel gate-header-panel">
                  <div>
                    <div className="title-line">
                      <span className="gate-badge">Gate {gate.number}</span>
                      {selectedGate < project.stageIndex && <span className="passed-badge"><BadgeCheck size={15} /> Passed</span>}
                      {selectedGate > project.stageIndex && <span className="locked-badge"><LockKeyhole size={14} /> Upcoming</span>}
                    </div>
                    <h2>{gate.label}</h2>
                    <p>{gate.purpose}</p>
                  </div>
                  <div className={`readiness-score ${selectedBlockers.length === 0 ? "ready" : ""}`}>
                    <strong>{selectedBlockers.length === 0 ? "Ready" : selectedBlockers.length}</strong>
                    <span>{selectedBlockers.length === 0 ? "requirements satisfied" : "items blocking this gate"}</span>
                  </div>
                </section>

                {selectedGate === 0 && (
                  <section className="panel">
                    <div className="section-heading">
                      <div>
                        <p className="eyebrow">CRM quick reference</p>
                        <h2>Facts needed to hand off the project</h2>
                      </div>
                      <p>Enter the controlling answer or link. Do not paste a meeting summary.</p>
                    </div>
                    <div className="form-grid">
                      {QUICK_REFERENCE_FIELDS.map((field) => (
                        <TextField key={field.key} field={field} value={project.quickReference[field.key]} onChange={(value) => updateQuickReference(field.key, value)} />
                      ))}
                    </div>
                    <div className="branch-question">
                      <div>
                        <strong>Is landlord or site permission required?</strong>
                        <span>This answer controls whether the site-permission execution task applies.</span>
                      </div>
                      <div className="segmented">
                        {["Unknown", "Required", "Not required"].map((option) => (
                          <button key={option} className={project.landlordPermission === option ? "active" : ""} onClick={() => mutateProject((current) => ({ ...current, landlordPermission: option }))}>{option}</button>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                <section className="panel checklist-panel">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">Required checklist</p>
                      <h2>{gate.label} checks</h2>
                    </div>
                    <p>Complete requires evidence. N/A requires a reason.</p>
                  </div>
                  <div className="task-list">
                    {gateTasks.map((task) => (
                      <TaskRow key={task.id} task={task} record={project.tasks[task.id]} onChange={(key, value) => updateTask(task.id, key, value)} />
                    ))}
                  </div>
                </section>

                {selectedGate <= 2 && (
                  <section className="panel parallel-panel">
                    <div className="section-heading">
                      <div>
                        <p className="eyebrow">Parallel execution lanes</p>
                        <h2>Open work as soon as its inputs exist</h2>
                      </div>
                      <p>These lanes do not wait for unrelated work.</p>
                    </div>
                    <div className="lane-grid">
                      {["EPC / Contract", "Design / Engineering", "Finance", "Buyer / Owner", "Site"].map((lane) => {
                        const tasks = TASKS.filter((task) => task.gateId === "return" && task.lane === lane);
                        return (
                          <article key={lane} className="lane-card">
                            <GitBranch size={18} />
                            <strong>{lane}</strong>
                            {tasks.map((task) => (
                              <button key={task.id} onClick={() => setSelectedGate(2)}>
                                <span className={`mini-dot ${statusClass(project.tasks[task.id].status)}`} />
                                {task.title}
                              </button>
                            ))}
                          </article>
                        );
                      })}
                    </div>
                  </section>
                )}
              </div>

              <aside className="side-column">
                <section className="panel gate-control">
                  <p className="eyebrow">Gate control</p>
                  <h2>{project.stageIndex >= GATES.length ? "Project flow complete" : GATES[project.stageIndex].label}</h2>
                  {project.stageIndex < GATES.length ? (
                    <>
                      <div className="progress-line">
                        <div><span style={{ width: `${(currentProgress.completed / currentProgress.total) * 100}%` }} /></div>
                        <small>{currentProgress.completed} of {currentProgress.total} checks passed with the required owner, date, and evidence</small>
                      </div>
                      <label className="reviewer-field">
                        <span>Gate reviewer</span>
                        <select value={project.gateReviews[GATES[project.stageIndex].id]?.reviewer || ""} onChange={(event) => {
                          const currentGate = GATES[project.stageIndex];
                          mutateProject((current) => ({
                            ...current,
                            gateReviews: { ...current.gateReviews, [currentGate.id]: { ...current.gateReviews[currentGate.id], reviewer: event.target.value } }
                          }));
                        }}>
                          <option value="">Select reviewer</option>
                          {OWNER_OPTIONS.filter((owner) => owner !== "Unassigned").map((owner) => <option key={owner}>{owner}</option>)}
                        </select>
                      </label>
                      <button className={`advance-button ${blockers.length === 0 ? "ready" : ""}`} onClick={attemptAdvance}>
                        {blockers.length === 0 ? <CheckCircle2 size={21} /> : <LockKeyhole size={20} />}
                        {blockers.length === 0 ? `Pass ${GATES[project.stageIndex].label}` : `Review ${blockers.length} blockers`}
                      </button>
                      <p className="control-note">Passing records the reviewer and opens the next gate. It does not write to Zoho yet.</p>
                    </>
                  ) : <p className="complete-message"><CheckCircle2 size={22} /> All four gates have passed.</p>}
                </section>

                <section className="panel link-panel">
                  <p className="eyebrow">System links</p>
                  <h2>One project, four control points</h2>
                  {LINK_FIELDS.map((field) => (
                    <label key={field.key}>
                      <span>{field.label}</span>
                      <div>
                        <Link2 size={16} />
                        <input type="url" value={project.quickReference[field.key]} placeholder="Paste link" onChange={(event) => updateQuickReference(field.key, event.target.value)} />
                        {project.quickReference[field.key] && <a href={project.quickReference[field.key]} target="_blank" rel="noreferrer" aria-label={`Open ${field.label}`}><ExternalLink size={16} /></a>}
                      </div>
                    </label>
                  ))}
                </section>

                <section className="panel export-panel">
                  <p className="eyebrow">Zoho implementation packet</p>
                  <h2>Structured handoff output</h2>
                  <p>The packet carries project facts, gate state, task owners, dates, blockers, and evidence in one structured record.</p>
                  <button onClick={copyPacket}><Copy size={16} /> {copyState}</button>
                  <button onClick={exportPacket}><Download size={16} /> Download JSON</button>
                </section>

                <section className="panel activity-panel">
                  <p className="eyebrow">Gate history</p>
                  {project.activity.slice(0, 5).map((item) => (
                    <div key={`${item.at}-${item.text}`}><BadgeCheck size={16} /><p>{item.text}<small>{formatDate(item.at)}</small></p></div>
                  ))}
                  <button className="reset-button" onClick={resetPrototype}><RefreshCcw size={14} /> Reset local prototype</button>
                </section>
              </aside>
            </div>
          </>
        )}
      </div>

      {showBlockers && project.stageIndex < GATES.length && <MissingModal gate={GATES[project.stageIndex]} blockers={blockers} onClose={() => setShowBlockers(false)} />}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
