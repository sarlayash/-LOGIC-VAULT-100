# -*- coding: utf-8 -*-
import json
import os

from generate_data import PROBLEMS_RAW

DOMAIN_MAP = {
    "Banking, FinTech & Insurance": {
        "id": 1,
        "color": "#eab308",
        "description": "Financial risk, fraud mitigation, credit scoring, underwriting and settlement workflows.",
        "icon": "landmark"
    },
    "Healthcare, Hospitals & Pharma": {
        "id": 2,
        "color": "#ec4899",
        "description": "Clinical emergency queues, cold-chain safety, bed allocation and pharmacovigilance.",
        "icon": "heart-pulse"
    },
    "Retail, E-commerce & Consumer Goods": {
        "id": 3,
        "color": "#f59e0b",
        "description": "Fulfillment promise engines, margin guardrails, returns logic and inventory balancing.",
        "icon": "shopping-bag"
    },
    "Manufacturing, Supply Chain & Logistics": {
        "id": 4,
        "color": "#3b82f6",
        "description": "Bottleneck detection, dynamic routing, predictive maintenance and reverse logistics.",
        "icon": "truck"
    },
    "Education, EdTech & Workforce Development": {
        "id": 5,
        "color": "#8b5cf6",
        "description": "Skill gap matrices, placement matching, retention triggers and credential issuance.",
        "icon": "graduation-cap"
    },
    "IT, SaaS, Cybersecurity & Cloud Operations": {
        "id": 6,
        "color": "#06b6d4",
        "description": "Severity classification, zero-trust access reviews, rate limiters and finops anomalies.",
        "icon": "server"
    },
    "Government, Public Services & Smart Cities": {
        "id": 7,
        "color": "#10b981",
        "description": "Public grievance routing, municipal waste planning, water loss triage and dispatch.",
        "icon": "building"
    },
    "Energy, Utilities & Sustainability": {
        "id": 8,
        "color": "#84cc16",
        "description": "Grid load forecasting, battery BESS arbitrage, carbon ledgers and peak shaving.",
        "icon": "zap"
    },
    "Travel, Hospitality, Aviation & Mobility": {
        "id": 9,
        "color": "#f97316",
        "description": "Overbooking risk bounds, disruption re-routing, fleet allocation and room turnarounds.",
        "icon": "plane"
    },
    "Agriculture, Food Systems & Rural Enterprise": {
        "id": 10,
        "color": "#14b8a6",
        "description": "Precision irrigation schedules, milk quality gates, farm equipment pools and recall chains.",
        "icon": "sprout"
    },
    "Telecom, Media & Digital Platforms": {
        "id": 11,
        "color": "#6366f1",
        "description": "Outage radius estimators, CDN streaming QoS watchers, ad pacing and creator payouts.",
        "icon": "radio"
    },
    "HR, Professional Services & Enterprise Operations": {
        "id": 12,
        "color": "#e11d48",
        "description": "Workforce capacity forecasting, payroll reconciliation, margin guards and action trackers.",
        "icon": "briefcase"
    }
}

def generate_pseudocode(p_id, title, domain, inputs, outputs, constraint):
    fn_name = title.lower().replace("-", "_").replace(" ", "_").replace("/", "_")
    param_str = ", ".join(inputs)
    
    pseudo = f"""FUNCTION evaluate_{fn_name}({param_str}):
    // -------------------------------------------------------------------------
    // SYSTEM GOAL: {title} ({domain})
    // CONSTRAINT RULE: {constraint}
    // -------------------------------------------------------------------------
    
    // STEP 1: Input Integrity & Null/Boundary Validation
    FOR EACH parameter IN [{param_str}]:
        IF parameter IS NULL OR parameter IS UNDEFINED THEN
            LOG_EVENT("AUDIT_WARN", "Missing telemetric or transactional signal", parameter)
            RETURN {{"status": "{outputs[1] if len(outputs) > 1 else outputs[0]}", "reason": "Missing required field: " + parameter, "flag_manual": TRUE}}
        END IF
    END FOR

    // STEP 2: Parameter Range & Outlier Sanitization
    INITIALIZE risk_score = 0
    INITIALIZE decision_notes = []
    
    // Domain-Specific Decision Tree
    IF {inputs[0]} <= 0 THEN
        RETURN {{"status": "INVALID_INPUT", "reason": "Primary metric value non-positive", "score": 0}}
    END IF

    // STEP 3: Rule Evaluation & Threshold Gating"""
    
    if len(inputs) >= 2:
        pseudo += f"""
    IF {inputs[1]} == TRUE OR {inputs[1]} > 75 THEN
        risk_score = risk_score + 40
        APPEND "High variance/anomaly detected on primary secondary metric" TO decision_notes
    END IF"""

    if len(inputs) >= 3:
        pseudo += f"""
    IF {inputs[2]} IS NOT NULL AND {inputs[2]} > 50 THEN
        risk_score = risk_score + 35
        APPEND "Elevated stress metric detected" TO decision_notes
    END IF"""

    pseudo += f"""
    // STEP 4: Guardrail Enforcement (Respecting Real-World Constraint)
    // Mandatory verification: "{constraint}"
    
    IF risk_score >= 70 THEN
        LOG_EVENT("ACTION_ESCALATE", "Upper critical threshold crossed", risk_score)
        RETURN {{
            "decision": "{outputs[-1]}",
            "score": risk_score,
            "evidence": decision_notes,
            "requires_human_signoff": TRUE,
            "timestamp": CURRENT_TIMESTAMP()
        }}
    ELSE IF risk_score >= 35 THEN
        LOG_EVENT("ACTION_REVIEW", "Medium risk tier identified", risk_score)
        RETURN {{
            "decision": "{outputs[1] if len(outputs) > 1 else outputs[0]}",
            "score": risk_score,
            "evidence": decision_notes,
            "requires_human_signoff": FALSE,
            "timestamp": CURRENT_TIMESTAMP()
        }}
    ELSE
        LOG_EVENT("ACTION_APPROVE", "Safe operating thresholds confirmed", risk_score)
        RETURN {{
            "decision": "{outputs[0]}",
            "score": risk_score,
            "evidence": ["All baseline validation tests passed within nominal tolerance"],
            "requires_human_signoff": FALSE,
            "timestamp": CURRENT_TIMESTAMP()
        }}
    END IF
END FUNCTION"""
    return pseudo

def build_full_problem_record(raw):
    p_id, title, domain, statement, constraint, inputs, outputs, domain_code, icon = raw
    
    domain_info = DOMAIN_MAP.get(domain, {
        "id": 1, "color": "#ffd700", "description": domain, "icon": icon
    })
    
    num_str = f"{p_id:03d}"
    
    understanding = (
        f"The primary business objective of '{title}' is to systematically resolve operational bottlenecks and risk uncertainties "
        f"in {domain}. The core decision-maker (system engine, operations specialist, or frontline analyst) evaluates multi-dimensional "
        f"signals ({', '.join(inputs)}) to safely determine the operational state ({' | '.join(outputs)}). "
        f"Business impact includes financial risk mitigation, strict regulatory compliance, loss prevention, and enhanced operational speed."
    )
    
    rules = [
        f"Hard policy constraint: {constraint}",
        f"Input validation rule: All parameters must be non-null and within certified operational tolerances.",
        f"Auditability threshold: Every non-standard decision must generate a structured event log with timestamp.",
        f"Graceful degradation: In case of telemetry failure, the engine must enter a failsafe state without silent default assignment.",
        f"Human escalation boundary: Any override or top-tier classification requires secondary multi-party authorization."
    ]
    
    io_design = {
        "inputs": [
            {"field": inp, "type": "Numeric / String / Boolean", "range": "Valid non-empty domain values", "missing_strategy": "Halt or flag review (do not default to 0)"}
            for inp in inputs
        ],
        "outputs": {
            "primary_states": outputs,
            "payload_fields": ["decision_code", "confidence_or_risk_score", "evidence_audit_trail", "timestamp", "human_approval_required"]
        }
    }
    
    algo_steps = [
        "1. Ingest raw event payload from telemetry or transaction stream.",
        "2. Sanitize and validate inputs against field bounds and type invariants.",
        f"3. Evaluate high-priority safety constraint: '{constraint}'.",
        "4. Calculate normalized impact score using weighted domain heuristics.",
        "5. Apply multi-tier conditional routing gates against calibrated thresholds.",
        "6. Attach structured rationale evidence and dispatch decision payload to audit queue."
    ]
    
    edge_cases = [
        {"case": "Missing / Null Telemetry Signal", "handling": "Do not treat missing data as zero; trigger failsafe flag and route to review queue."},
        {"case": "Duplicate Concurrent Payloads", "handling": "Enforce idempotency key check with sliding window dedup cache."},
        {"case": "Exact Boundary Value Equality", "handling": "Calibrate strict inequality rules (< vs <=) with deterministic tie-breaking logic."},
        {"case": "Conflicting High-Severity Signals", "handling": "Prioritize consumer/patient/worker safety above operational throughput metrics."},
        {"case": "Downstream Service Timeout / Offline", "handling": "Store serialized event in persistent dead-letter queue with exponential backoff retry."}
    ]
    
    test_cases = [
        {
            "test_id": "TC-01",
            "name": "Nominal Standard Path",
            "inputs": {inputs[0]: "Standard Valid", inputs[1]: "Within Bounds"},
            "expected_output": outputs[0],
            "reason": "All metrics within certified healthy thresholds."
        },
        {
            "test_id": "TC-02",
            "name": "High Risk / Critical Spike",
            "inputs": {inputs[0]: "Severe Anomaly", inputs[1]: "Triggered"},
            "expected_output": outputs[-1],
            "reason": "Critical threshold breached; safety overrides active."
        },
        {
            "test_id": "TC-03",
            "name": "Missing Data Exception",
            "inputs": {inputs[0]: "Null/Missing"},
            "expected_output": "MANUAL_REVIEW / REJECT",
            "reason": "Explicit failure on missing signal as mandated by real-world constraint."
        },
        {
            "test_id": "TC-04",
            "name": "Boundary Threshold Value",
            "inputs": {inputs[0]: "Exact Threshold Limit"},
            "expected_output": outputs[1] if len(outputs) > 1 else outputs[0],
            "reason": "Verified boundary stability with no floating point jitter."
        },
        {
            "test_id": "TC-05",
            "name": "Contradictory Signal Test",
            "inputs": {inputs[0]: "High volume", inputs[1]: "Verified whitelist"},
            "expected_output": outputs[1] if len(outputs) > 1 else outputs[0],
            "reason": "Volume alone must not falsely trigger fraud or rejection."
        }
    ]
    
    complexity = {
        "time_complexity": "O(1) constant time for fixed rule inspection, O(N) where N is record count in batch mode.",
        "space_complexity": "O(1) auxiliary working memory per evaluation event.",
        "human_approval_points": "Final escalation requires supervisor signoff; automated systems provide assisted recommendations only.",
        "system_risks": "Risk of model drift if underlying consumer behaviors change; annual rule calibration required."
    }
    
    pseudo = generate_pseudocode(p_id, title, domain, inputs, outputs, constraint)
    
    return {
        "id": p_id,
        "code": num_str,
        "title": title,
        "domain": domain,
        "domainId": domain_info["id"],
        "domainColor": domain_info["color"],
        "domainIcon": domain_info["icon"],
        "problemStatement": statement,
        "realWorldConstraint": constraint,
        "understanding": understanding,
        "assumptionsAndRules": rules,
        "inputOutputDesign": io_design,
        "algorithmSteps": algo_steps,
        "pseudocode": pseudo,
        "edgeCases": edge_cases,
        "testCases": test_cases,
        "complexity": complexity
    }

def main():
    problems = [build_full_problem_record(p) for p in PROBLEMS_RAW]
    out_dir = r"C:\Users\LC\.gemini\antigravity\scratch\kapil-logic-vault-100\js"
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "data-problems.js")
    
    js_content = "// ==========================================================================\n"
    js_content += "// KAPIL'S LOGIC-VAULT 100: Comprehensive Industry Problem Statements Database\n"
    js_content += "// Powered By Kapil • SarlaYash Learning Solutions LLP\n"
    js_content += "// 100 Real Operational Industry Decisions Across 12 Domains\n"
    js_content += "// ==========================================================================\n\n"
    js_content += "const DOMAINS_LIST = " + json.dumps(list(DOMAIN_MAP.items()), indent=2) + ";\n\n"
    js_content += "const ALL_PROBLEMS = " + json.dumps(problems, indent=2) + ";\n\n"
    js_content += "if (typeof module !== 'undefined' && module.exports) {\n"
    js_content += "    module.exports = { DOMAINS_LIST, ALL_PROBLEMS };\n"
    js_content += "}\n"
    
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(js_content)
        
    print(f"Successfully generated {len(problems)} full problems to {out_file}")

if __name__ == "__main__":
    main()
