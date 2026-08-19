import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Database,
  ExternalLink,
  FileStack,
  FolderOpen,
  GitBranch,
  ShieldCheck,
  Wrench,
  X
} from "lucide-react";
import "./styles.css";

const nodes = [
  {
    id: "intake",
    number: "01",
    title: "Intake",
    subtitle: "Facts enter once.",
    icon: ClipboardList,
    summary:
      "The intake form is the first control point. It turns a referral, sales conversation, or project idea into structured data that can be routed, checked, and monitored.",
    owner: "Sales / originating team",
    sections: [
      {
        title: "What The Form Captures",
        items: [
          "Working project name or opportunity name, site address if known, utility, contact basics, and customer/host information.",
          "Power user, referral partner, EPC path, system-owner path, buyer path, and current decision-maker when known or suspected.",
          "Project type: PPA, cash, grant, roof, ground, carport, mixed, battery, no battery, or phased build.",
          "Early technical facts: estimated system size, production, mounting type, battery status, utility/interconnection notes, and visible site constraints."
        ]
      },
      {
        title: "Why It Exists",
        items: [
          "It keeps the first project record from becoming scattered across Slack, Gmail, WhatsApp, portal messages, and memory.",
          "It gives CRM enough structure to create the deal, assign or confirm the four-digit project number, and show what branch should move next.",
          "Don’s automation is tied to this intake path, so agents can monitor the same structured starting point instead of chasing informal updates."
        ]
      },
      {
        title: "How It Routes Work",
        items: [
          "PPA path opens buyer/system-owner and finance tracking.",
          "Battery or storage path opens additional technical, utility, and design questions before handoff.",
          "EPC path opens scope, pricing, agreement, procurement, schedule, and warranty tracking.",
          "Missing information becomes a named CRM open item instead of disappearing."
        ]
      },
      {
        title: "Exit Condition",
        items: [
          "The intake step is done when the CRM deal can be created or updated, the project number can be assigned in CRM, the Drive folder can be created or linked, and the first known/missing answer set is visible."
        ]
      }
    ],
    links: []
  },
  {
    id: "crm-drive",
    number: "02",
    title: "CRM + Drive",
    subtitle: "Control record plus source files.",
    icon: Database,
    summary:
      "CRM shows the current project truth. Drive holds the files that support it. Together, they should answer the top-level questions without requiring a search party.",
    owner: "CRM owner / intake owner",
    sections: [
      {
        title: "CRM Must Show",
        items: [
          "Deal name, CRM-assigned four-digit project number, stage, attention status, next action, next action date, blocker, and current owner.",
          "Project Quick Reference: power user, referral partner, customer/host, EPC company/contact, system owner or buyer path, project size, production, mounting, battery, site address, and target completion.",
          "Commercial facts that matter for the deal type: PPA rate, term, signature status, buyer status, CLA/draw path, financial model status, and open cash/model inputs.",
          "A short note explaining what changed, what is still needed, and who owns it."
        ]
      },
      {
        title: "Drive Must Hold",
        items: [
          "A standardized project folder created from or renamed to match the CRM deal name and assigned four-digit project number.",
          "PPA, CLA/funding files, model, design/proposal, site documents, utility evidence, EPC agreement, signature packet, and closeout files.",
          "Useful email, Slack, portal, and WhatsApp attachments saved into the right project folder when they become source material."
        ]
      },
      {
        title: "Why The Quick Reference Matters",
        items: [
          "It answers the questions Chris asks first: what kind of project, who is the system owner, who is the power user, who referred it, how big it is, what is missing, and who owns the next move.",
          "It prevents contradictions between top-level fields, buried fields, notes, attachments, and message threads.",
          "It gives both users and automation one place to verify the current answer."
        ]
      },
      {
        title: "Exit Condition",
        items: [
          "CRM and Drive are ready when the project can be reviewed from the deal page without rebuilding the facts from messages."
        ]
      }
    ],
    links: []
  },
  {
    id: "gate-in",
    number: "03",
    title: "Handoff Gate",
    subtitle: "Ready for EPC / engineering.",
    icon: BadgeCheck,
    summary:
      "This is the hard checkpoint before the project leaves CRM control and enters the EPC/engineering lane. It exists to stop messy handoffs from creating rework.",
    owner: "Nathan confirms the gate and handoff",
    sections: [
      {
        title: "Business Checklist",
        items: [
          "CRM deal exists with the assigned four-digit project number and matching Drive folder.",
          "Power user is identified or marked open with owner.",
          "Customer/host and site address are identified or marked open with owner.",
          "Referral partner/source is identified or marked none after review.",
          "System owner or buyer path is identified, including backup buyer if known.",
          "Project type is clear: PPA, cash, grant, battery, roof, ground, carport, mixed, or phased."
        ]
      },
      {
        title: "Technical Checklist",
        items: [
          "Current model/design basis is linked.",
          "System size, annual production, mounting detail, panel/inverter assumptions, battery status, and utility/interconnection context are visible.",
          "Known constraints are stated plainly: LUMA, PRIDCO, permitting, roof, structural, procurement, schedule, or access."
        ]
      },
      {
        title: "Commercial Checklist",
        items: [
          "PPA status, rate, term, sent/executed/pending status, and signature owner are visible.",
          "Financial path is clear: buyer, system owner, CLA, draw model, tax/entity documents, or cash requirements.",
          "Open items are assigned to a person with a next action, not left as vague project noise."
        ]
      },
      {
        title: "Exit Condition",
        items: [
          "The project moves into EPC/engineering only when CRM Quick Reference, Drive source folder, assigned open items, and handoff note are complete enough for execution to start without going backward."
        ]
      }
    ],
    links: []
  },
  {
    id: "epc",
    number: "04",
    title: "EPC + Engineering",
    subtitle: "Execution lane in Zoho Projects.",
    icon: Wrench,
    summary:
      "Zoho Projects starts here. This lane is for execution work, not front-end sales cleanup. The numbered project stays tied to the matching CRM deal and Drive folder.",
    owner: "EPC / engineering lead manages this lane",
    sections: [
      {
        title: "What Gets Accepted",
        items: [
          "CRM handoff note, assigned project number, and current Project Quick Reference.",
          "Drive folder with current source files.",
          "Known project size, mounting, production, customer/host, power user, EPC path, buyer/system-owner path, and open blockers.",
          "Known commercial and technical assumptions that must be respected."
        ]
      },
      {
        title: "What Happens Here",
        items: [
          "EPC agreement comments, scope, pricing, inclusions/exclusions, warranty position, and schedule.",
          "Engineering/design basis, model review, equipment path, panel/inverter assumptions, mounting and structural comfort.",
          "Utility, LUMA, PRIDCO, interconnection, permitting, disconnects, site access, and approval status.",
          "Procurement split, lead times, installer responsibility, stock assumptions, shipping, and build readiness."
        ]
      },
      {
        title: "How It Is Tracked",
        items: [
          "After handoff, each numbered project in Zoho Projects uses the EPC/engineering structure and starts at the handoff point.",
          "Tasks move through open, in progress, waiting, complete, or blocked status.",
          "Delegation can happen inside the lane, but status must stay visible in Zoho Projects and tied back to CRM."
        ]
      },
      {
        title: "Exit Condition",
        items: [
          "The lane is complete when EPC/engineering can say what is ready, what is signed or priced, what is blocked, and what must return to CRM for final action."
        ]
      }
    ],
    links: []
  },
  {
    id: "gate-out",
    number: "05",
    title: "Return Gate",
    subtitle: "Execution complete or blocked.",
    icon: ShieldCheck,
    summary:
      "The return gate mirrors the handoff gate. The project comes back with enough information to close, escalate, or assign the final next move.",
    owner: "EPC / engineering lead returns to Nathan",
    sections: [
      {
        title: "Return Checklist",
        items: [
          "CRM-to-EPC handoff happened and is documented.",
          "Handoff inputs were used, updated, or rejected with a reason.",
          "EPC agreement, pricing, design basis, utility/permitting status, procurement, schedule, and warranty status are current.",
          "Files created during EPC/engineering are in the correct Drive folder.",
          "Unresolved items are assigned to the correct person with the actual next step."
        ]
      },
      {
        title: "Parallel Work Check",
        items: [
          "Buyer/system-owner path is current.",
          "Financial model, CLA/draw/cash items, and tax/entity items are current.",
          "Contract or signature path is current.",
          "Outside communications that changed the deal are captured in CRM and Drive."
        ]
      },
      {
        title: "Exit Condition",
        items: [
          "Nathan can accept the project back when the execution lane and parallel branches are current enough to finalize CRM without another cleanup hunt."
        ]
      }
    ],
    links: []
  },
  {
    id: "closeout",
    number: "06",
    title: "CRM Closeout",
    subtitle: "Final record and final next step.",
    icon: FileStack,
    summary:
      "Closeout writes the final operating truth back into CRM. The project should be readable later without needing the people who worked it to explain what happened.",
    owner: "Nathan",
    sections: [
      {
        title: "Final CRM Updates",
        items: [
          "Deal stage, attention status, next action, due date, blocker, and owner are current.",
          "Project Quick Reference reflects final known answers and does not conflict with fields below it.",
          "Site address, customer/host, power user, referral partner, EPC, system owner/buyer, project size, mounting, production, battery, and target date are aligned.",
          "Financial, legal, buyer, EPC, and source links are attached or referenced."
        ]
      },
      {
        title: "Final Decision",
        items: [
          "Close it out if there are no further actions.",
          "Leave it open with a named owner and date if there is still a real next step.",
          "Escalate it if the remaining blocker is outside the current owner’s lane."
        ]
      },
      {
        title: "Exit Condition",
        items: [
          "The project is complete when CRM shows the final status, Drive has the final files, and no hidden work is sitting in messages."
        ]
      }
    ],
    links: []
  }
];

const parallel = {
  id: "parallel",
  title: "Parallel Work",
  subtitle: "Business work moving beside execution.",
  icon: GitBranch,
  summary:
    "Parallel work is the buyer, finance, legal, contract, CLA, and source-control work that can move while EPC/engineering advances. It moves at the same time, but it stays visible in CRM.",
  owner: "Assigned by branch",
  sections: [
    {
      title: "Buyer / System Owner",
      items: [
        "Identify first outreach, backup buyer, system-owner candidate, and what package can be sent.",
        "Update CRM when the buyer path changes so the project does not stall on old assumptions."
      ]
    },
    {
      title: "Financials",
      items: [
        "Keep model assumptions, PPA economics, CLA, draws, cash needs, tax/entity documents, and unresolved inputs visible.",
        "Michael/Ricky work can continue while EPC moves, but open inputs stay named in CRM."
      ]
    },
    {
      title: "Contracts / Legal",
      items: [
        "Track signed PPA, land/site authorization, MNDA, EPC agreement, redlines, and signature status.",
        "Do not treat a deal as ready if the controlling document is missing, stale, or unsigned."
      ]
    },
    {
      title: "Source Control",
      items: [
        "Move useful email, Slack, portal, WhatsApp, and attachment evidence into Drive.",
        "Summarize the actual business answer in CRM so nobody has to read the whole thread to know the status."
      ]
    },
    {
      title: "Exit Condition",
      items: [
        "Each parallel branch has one owner, one current next step, one visible status, and no contradiction with the CRM Quick Reference."
      ]
    }
  ],
  links: []
};

function Modal({ item, onClose }) {
  if (!item) return null;
  const Icon = item.icon;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={item.title} onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close details">
          <X size={22} />
        </button>
        <div className="modal-head">
          <div className="modal-icon"><Icon size={36} /></div>
          <div>
            <p>{item.subtitle}</p>
            <h2>{item.title}</h2>
          </div>
        </div>
        <p className="modal-summary">{item.summary}</p>
        <div className="owner-line">
          <strong>Owner:</strong>
          <span>{item.owner}</span>
        </div>
        <div className="modal-sections">
          {item.sections.map((section) => (
            <article className="modal-section" key={section.title}>
              <h3>{section.title}</h3>
              {section.items.map((text) => (
                <div className="modal-check" key={text}>
                  <CheckCircle2 size={18} />
                  <span>{text}</span>
                </div>
              ))}
            </article>
          ))}
        </div>
        {item.links.length > 0 && (
          <div className="modal-links">
            {item.links.map(([label, href]) => (
              <a href={href} target="_blank" rel="noreferrer" key={href}>
                {label}
                <ExternalLink size={15} />
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function App() {
  const [openItem, setOpenItem] = useState(null);

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Soltaic Project Flow</p>
          <h1>Intake to CRM, handoff to EPC + engineering, return to CRM.</h1>
          <p>
            One control path: raw intake becomes a numbered CRM record, source files stay linked, execution is managed in Projects, and the final record lands back in CRM.
          </p>
        </div>
        <div className="control-card">
          <CheckCircle2 size={22} />
          <div>
            <strong>Operating Rule</strong>
            <span>CRM owns the truth. Drive owns the files. Zoho Projects starts only after the handoff gate.</span>
          </div>
        </div>
      </section>

      <section className="flow-panel" aria-label="Project flow">
        <div className="flow-row">
          {nodes.slice(0, 4).map((node, index) => {
            const Icon = node.icon;
            return (
              <React.Fragment key={node.id}>
                <button className="node-card" onClick={() => setOpenItem(node)}>
                  <span className="node-number">{node.number}</span>
                  <Icon size={30} />
                  <strong>{node.title}</strong>
                  <small>{node.subtitle}</small>
                </button>
                {index < 3 && <ArrowRight className="flow-arrow" size={30} />}
              </React.Fragment>
            );
          })}
        </div>

        <div className="return-row">
          <button className="parallel-card" onClick={() => setOpenItem(parallel)}>
            <GitBranch size={32} />
            <div>
              <strong>Parallel Work</strong>
              <span>Buyer / system owner, finance, legal, contracts, CLA, source control.</span>
            </div>
          </button>
          <ArrowRight className="flow-arrow" size={30} />
          {nodes.slice(4).map((node) => {
            const Icon = node.icon;
            return (
              <button className="node-card small" key={node.id} onClick={() => setOpenItem(node)}>
                <span className="node-number">{node.number}</span>
                <Icon size={30} />
                <strong>{node.title}</strong>
                <small>{node.subtitle}</small>
              </button>
            );
          })}
        </div>
      </section>

      <footer>
        <FolderOpen size={16} />
        <span>Intake, CRM, Drive, Zoho Projects, financials, and closeout stay tied to the CRM-assigned project number.</span>
      </footer>

      <Modal item={openItem} onClose={() => setOpenItem(null)} />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
