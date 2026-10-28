# -*- coding: utf-8 -*-
"""
Generator script for 5 Mock Tests and 1 Final Assessment in Kapil's Logic-Vault 100
"""
import json
import os

MOCK_TESTS = [
    {
        "id": "mock-1",
        "title": "Mock Test 1: Banking, FinTech & Retail Architecture",
        "description": "Assess your understanding of fraud triage, payment duplicates, loan pre-screens, margin guardrails, and returns engines.",
        "durationMinutes": 15,
        "passScorePct": 70,
        "questions": [
            {
                "id": "m1_q1",
                "question": "In Problem 001 (Fraud-Risk Transaction Triage), why must a high transaction amount alone NOT automatically trigger a fraud rejection?",
                "options": [
                    "Because high-net-worth customers legitimately make large purchases, and single-signal blocking causes massive false positive churn.",
                    "Because all banks legally require a minimum of 48 hours before rejecting any transaction.",
                    "Because the credit card terminal will automatically retry the charge if declined.",
                    "Because merchants are solely liable for any transaction under $10,000."
                ],
                "correctIndex": 0,
                "explanation": "Real-world constraint for 001 explicitly states: 'A high amount alone must not automatically prove fraud; missing signals must be handled explicitly.' Legitimate transactions can have high amounts; multi-vector signals (device, velocity, location) are required."
            },
            {
                "id": "m1_q2",
                "question": "When designing duplicate payment detection (Problem 002), how should legitimate recurring subscription debits be differentiated from erroneous duplicates?",
                "options": [
                    "By immediately blocking all transactions with identical amounts within a 30-day window.",
                    "By evaluating the exact timestamp window, recurring mandate reference/token, and merchant category.",
                    "By converting all transactions to USD before comparison.",
                    "By asking the customer via phone call for every transaction."
                ],
                "correctIndex": 1,
                "explanation": "Legitimate subscriptions share amounts and beneficiary IDs, but feature recurring mandate identifiers and regular monthly/annual periodicity outside duplicate burst windows."
            },
            {
                "id": "m1_q3",
                "question": "In Loan Eligibility Pre-Screen (Problem 003), what is the mandatory handling rule when an applicant's existing obligation data is missing?",
                "options": [
                    "Default existing obligations to 0 so the calculation proceeds smoothly.",
                    "Estimate existing obligations as 20% of their reported income.",
                    "Do not silently treat missing data as zero; route application to 'NEEDS_REVIEW' with an explicit missing data alert.",
                    "Reject the applicant permanently with a bad credit remark."
                ],
                "correctIndex": 2,
                "explanation": "Constraint 003 specifies: 'Explain which rules failed; do not silently treat missing data as zero.' Defaulting to 0 would approve high-risk debt un-checked."
            },
            {
                "id": "m1_q4",
                "question": "In Retail Promotion Margin Guardrails (Problem 023), what critical variables must be subtracted from the discounted price before declaring a promotion safe?",
                "options": [
                    "Only the manufacturer cost of goods (COGS).",
                    "COGS, marketplace channel commissions, payment gateway fees, and shipping subsidies.",
                    "Only the state sales tax.",
                    "The marketing advertising spend divided by total global employees."
                ],
                "correctIndex": 1,
                "explanation": "Promotions often appear profitable on gross margin (Price - COGS) but become loss-making once channel fees, shipping subsidies, and payment costs are included."
            },
            {
                "id": "m1_q5",
                "question": "Under the Returns Eligibility Engine (Problem 020), if a customer returns an item without a receipt but within 14 days for a defective item, what is the best logic flow?",
                "options": [
                    "Immediate unappealable rejection because receipt is mandatory.",
                    "Full cash refund with no inspection.",
                    "Route to manual inspection / store credit verification according to policy exceptions.",
                    "Issue a 200% penalty charge to the customer's account."
                ],
                "correctIndex": 2,
                "explanation": "Real-world constraint 020: 'Support exceptions and show the rule behind the outcome.' Defective items qualify under statutory consumer warranties requiring inspection."
            },
            {
                "id": "m1_q6",
                "question": "In Product Substitution Recommender (Problem 024), what is the strict constraint regarding dietary and allergen requirements?",
                "options": [
                    "Allergens can be ignored if the substitute has a 5-star customer rating.",
                    "Hard constraints such as allergens must never be traded off for a higher recommendation score.",
                    "Allergens may be allowed if the replacement is discounted by more than 30%.",
                    "Allergens only matter if the total cart value is over $100."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 024: 'Hard constraints such as allergens must never be traded off for a better score.' Doing so creates life-threatening liabilities."
            },
            {
                "id": "m1_q7",
                "question": "For ATM Cash Replenishment (Problem 005), what is the consequence of failing to account for supplier replenishment lead time?",
                "options": [
                    "The ATM will order double the amount of cash.",
                    "The ATM will run completely dry before the armored vehicle arrives, violating SLA and stranding cardholders.",
                    "The ATM screen will switch to Spanish.",
                    "The cash inside the ATM will expire."
                ],
                "correctIndex": 1,
                "explanation": "If lead time is 6 hours and cash drops below 6 hours of average burn, the ATM will run out of cash before physical delivery completes."
            },
            {
                "id": "m1_q8",
                "question": "In Order Promise-Date Calculator (Problem 019), which inventory state MUST be excluded from promise date estimations?",
                "options": [
                    "Stock in primary central warehouses.",
                    "Stock that is reserved for pending orders or undergoing quarantine inspection.",
                    "Stock received earlier that same morning.",
                    "Stock of products on seasonal discount."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 019: 'Do not promise stock that is reserved or unavailable.' Over-promising reserved inventory leads to delayed or canceled orders."
            },
            {
                "id": "m1_q9",
                "question": "In KYC Document Expiry Monitor (Problem 007), what must the system do when a customer possesses multiple documents with different expiry dates?",
                "options": [
                    "Only track whichever document expires latest.",
                    "Track each document independently and gate account features based on the earliest expiry of mandatory identity proofs.",
                    "Delete all older documents from the database.",
                    "Force the customer to re-register as a brand new account every 30 days."
                ],
                "correctIndex": 1,
                "explanation": "Different documents (passport, proof of address, tax ID) have distinct regulatory validity windows and must be monitored individually."
            },
            {
                "id": "m1_q10",
                "question": "In Cart Abandonment Recovery (Problem 021), what rule prevents spamming customers?",
                "options": [
                    "Never send any emails at all.",
                    "Send an SMS every 15 minutes until purchase.",
                    "Verify explicit marketing consent and enforce rolling frequency caps (e.g., max 1 contact per 7 days).",
                    "Only send messages between 2 AM and 4 AM."
                ],
                "correctIndex": 2,
                "explanation": "Constraint 021: 'Respect marketing consent and frequency caps.' Violating GDPR/TCPA leads to heavy fines and subscriber unsubscribe spikes."
            }
        ]
    },
    {
        "id": "mock-2",
        "title": "Mock Test 2: Healthcare, Hospitals & Public Systems",
        "description": "Assess emergency triage, cold-chain integrity, hospital bed allocation, water leak detection, and civic grievances.",
        "durationMinutes": 15,
        "passScorePct": 70,
        "questions": [
            {
                "id": "m2_q1",
                "question": "In Emergency Department Queue Triage (Problem 010), what is the relationship between algorithmic priority and clinical staff?",
                "options": [
                    "The algorithm overrides doctors and cannot be changed.",
                    "Clinical staff retain decision authority; missing or abnormal readings must be escalated safely.",
                    "Patients are admitted strictly first-come, first-served regardless of vital signs.",
                    "Triage is skipped if waiting room has fewer than 5 people."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 010: 'Clinical staff retain decision authority; missing or abnormal readings must be escalated safely.'"
            },
            {
                "id": "m2_q2",
                "question": "In Cold-Chain Temperature Excursion (Problem 018), what must occur when a vaccine cooler returns to the acceptable 2°C-8°C range after a 4-hour 18°C excursion?",
                "options": [
                    "Automatically mark the batch safe for immediate patient injection.",
                    "Quarantine stock and mandate authorized stability assessment; never assume safety simply because temperature returned to range.",
                    "Discard all electricity meters in the hospital.",
                    "Immediately increase the patient dosage."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 018: 'Do not automatically declare affected stock safe after a temperature returns to range.' Thermal degradation is cumulative and irreversible."
            },
            {
                "id": "m2_q3",
                "question": "In Hospital Bed Allocation (Problem 012), which bed condition makes a bed strictly unavailable?",
                "options": [
                    "Only if the patient in that bed is discharged.",
                    "Any bed marked as currently occupied OR not yet cleaned/sanitized.",
                    "Beds that are on higher floors.",
                    "Beds near nursing stations."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 012: 'A bed marked occupied or not cleaned is unavailable.' Assigning an uncleaned bed causes hospital-acquired infections."
            },
            {
                "id": "m2_q4",
                "question": "In Lab Sample Tracking (Problem 014), what state transition rule prevents diagnostic errors?",
                "options": [
                    "A sample must not advance to a state without required prior verified steps (e.g. collection -> receipt -> validation).",
                    "Samples can skip receipt and jump straight to report generation to save time.",
                    "Samples can be validated before being processed in the centrifuge.",
                    "Barcodes are optional if technician recognizes the patient."
                ],
                "correctIndex": 0,
                "explanation": "Constraint 014: 'A sample must not advance to a state without required prior steps.'"
            },
            {
                "id": "m2_q5",
                "question": "In Drug Interaction Alert Prioritisation (Problem 015), what source of data must the engine rely on?",
                "options": [
                    "Random internet blog posts.",
                    "Only verified, authoritative clinical interaction tables; do not invent heuristic rules.",
                    "Social media sentiment about pharmaceutical companies.",
                    "Whichever drug costs less."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 015: 'Use only supplied/verified interaction data; do not invent clinical rules.'"
            },
            {
                "id": "m2_q6",
                "question": "In Public Grievance SLA Manager (Problem 053), why is an auditable appeal or reopen mechanism required?",
                "options": [
                    "To allow citizens to contest false or superficial resolutions marked by administrative departments.",
                    "To generate more paperwork for government clerks.",
                    "To automatically delete complaints older than 3 days.",
                    "To prevent citizens from contacting courts."
                ],
                "correctIndex": 0,
                "explanation": "Constraint 053: 'Provide a traceable status and appeal/reopen route.' Ensures transparency and accountability."
            },
            {
                "id": "m2_q7",
                "question": "In Municipal Water Leakage Prioritisation (Problem 055), what factor gives a pipe leak the highest priority?",
                "options": [
                    "The color of the asphalt above the pipe.",
                    "High flow anomaly near critical public infrastructure (e.g., hospitals, schools) and severe pressure drop.",
                    "Whether the pipe was laid on a Tuesday.",
                    "Whether the leak makes audible splashing sounds on the curb."
                ],
                "correctIndex": 1,
                "explanation": "Prioritizing critical public service impact ensures hospitals and core zones retain water pressure and avoid structural contamination."
            },
            {
                "id": "m2_q8",
                "question": "In Public Transport Headway Control (Problem 056), how should 'bus bunching' be mitigated without violating safety?",
                "options": [
                    "Skip all wheelchair passenger stops to catch up schedule.",
                    "Hold the leading bus momentarily at high-capacity stops while allowing the chaser bus to run express without compromising passenger accessibility.",
                    "Instruct drivers to exceed city speed limits.",
                    "Cancel the bus route immediately."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 056: 'Do not optimise headway by skipping accessibility or safety requirements.'"
            },
            {
                "id": "m2_q9",
                "question": "In Permit Application Completeness (Problem 057), what must the output status clearly communicate to the applicant?",
                "options": [
                    "That passing completeness check guarantees the building permit is legally granted.",
                    "Completeness checks only confirm all required documents exist; they do NOT imply permit approval.",
                    "That the building can begin construction tomorrow.",
                    "That no human will ever review the blueprints."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 057: 'Completeness checks must not imply that a permit is approved.'"
            },
            {
                "id": "m2_q10",
                "question": "In Medical Equipment Maintenance (Problem 016), before taking an ICU ventilator offline for servicing, what check is non-negotiable?",
                "options": [
                    "Checking if the technician has had lunch.",
                    "Verifying certified fallback / backup equipment is available on site.",
                    "Turning off all emergency power generators.",
                    "Decreasing patient oxygen levels."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 016: 'Critical devices need fallback coverage before planned maintenance.'"
            }
        ]
    },
    {
        "id": "mock-3",
        "title": "Mock Test 3: Supply Chain, Logistics & Energy Operations",
        "description": "Assess production bottlenecks, fleet routing constraints, cold-chain logistics, battery dispatch, and peak shaving.",
        "durationMinutes": 15,
        "passScorePct": 70,
        "questions": [
            {
                "id": "m3_q1",
                "question": "In Fleet Route Planning (Problem 031), why is the shortest geographical distance route NOT necessarily a valid route?",
                "options": [
                    "Because vehicles only turn right.",
                    "A route that violates legal driver shift limits, axle weight limits, or road closures is strictly invalid regardless of distance.",
                    "Short routes always cost twice as much fuel.",
                    "Customers refuse early deliveries."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 031: 'A route that violates legal or safety constraints is invalid even if shorter.'"
            },
            {
                "id": "m3_q2",
                "question": "In Production Bottleneck Detection (Problem 028), what must be done before comparing cycle times across different work centers?",
                "options": [
                    "Multiply all cycle times by 10.",
                    "Normalize different measurement units and shift operating calendars.",
                    "Assume all machines operate 24/7 without maintenance.",
                    "Disregard scrap and defect rates."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 028: 'Different units and shift calendars must be normalised before comparison.'"
            },
            {
                "id": "m3_q3",
                "question": "In Warehouse Slotting Optimiser (Problem 030), where should hazardous or incompatible chemicals be assigned?",
                "options": [
                    "In the golden picking zone near the loading dock for speed.",
                    "Segregated into dedicated hazmat vaults adhering to compatibility and fire safety guidelines.",
                    "Directly on top of food pallets.",
                    "In whichever aisle has empty space regardless of contents."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 030: 'Heavy, hazardous, and incompatible items must follow safety rules.'"
            },
            {
                "id": "m3_q4",
                "question": "In Battery Dispatch Planner (Problem 064), what constraint overrides price arbitrage opportunities?",
                "options": [
                    "Never violating minimum state of charge (SoC) safety limits and required critical reserve backup capacity.",
                    "Selling power only when solar is shining.",
                    "Discharging the battery to 0% every day to maximize revenue.",
                    "Never charging the battery on weekends."
                ],
                "correctIndex": 0,
                "explanation": "Constraint 064: 'Never violate battery safety limits or minimum backup reserve.'"
            },
            {
                "id": "m3_q5",
                "question": "In Supplier Delivery Reliability Scoring (Problem 029), what ensures a fair evaluation?",
                "options": [
                    "Penalizing the supplier for shipments delayed by natural disasters and unconfirmed data.",
                    "Evaluating comparable time windows and excluding unverified carrier delay claims.",
                    "Only scoring suppliers with whom the CEO is friends.",
                    "Giving all suppliers a score of 100%."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 029: 'Use comparable periods and avoid penalising a supplier for unconfirmed data.'"
            },
            {
                "id": "m3_q6",
                "question": "In Industrial Energy Peak Shaving (Problem 068), which industrial loads can be recommended for rescheduling to off-peak periods?",
                "options": [
                    "Continuous critical safety ventilation systems.",
                    "Shiftable and interruptible batches that do not breach SLA or damage molten materials.",
                    "Emergency cooling pumps.",
                    "Fire suppression sprinkler systems."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 068: 'Do not interrupt critical processes or breach service commitments.'"
            },
            {
                "id": "m3_q7",
                "question": "In Quality Defect Containment (Problem 033), what is the first priority when an anomaly is identified in a manufactured batch?",
                "options": [
                    "Delete the production log to protect the operator.",
                    "Preserve end-to-end traceability and quarantine both confirmed and potentially exposed lots immediately.",
                    "Discount the defective parts by 10% and ship anyway.",
                    "Wait until customers complain."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 033: 'Preserve traceability and clearly separate confirmed from possible exposure.'"
            },
            {
                "id": "m3_q8",
                "question": "In Cold-Chain Shipment Monitor (Problem 035), what must the tracking system record when an IoT sensor stops transmitting?",
                "options": [
                    "Assume the temperature stayed at 4°C while offline.",
                    "Record missing sensor telemetry as an excursion anomaly requiring audit upon arrival.",
                    "Mark the cargo as delivered immediately.",
                    "Turn off the GPS unit."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 035: 'Store the excursion timeline and avoid treating missing sensor data as normal.'"
            },
            {
                "id": "m3_q9",
                "question": "In Purchase Order Exception Handler (Problem 034), what tolerance rule allows straight-through payment processing?",
                "options": [
                    "Paying invoices that exceed the PO amount by any value.",
                    "Authorised percentage tolerances (e.g., ±0.5% due to weight shrinkage or rounding) without manual intervention.",
                    "Ignoring item part numbers as long as prices look similar.",
                    "Paying for goods that have never been received at the dock."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 034: 'Support partial deliveries and authorised tolerances.'"
            },
            {
                "id": "m3_q10",
                "question": "In Reverse Logistics Decision (Problem 036), what dictates the routing of returned lithium-ion electronics?",
                "options": [
                    "Throwing them in standard municipal landfills.",
                    "Regulatory and safety handling compliance determining certified refurbishing, vendor return, or hazardous waste recycling.",
                    "Sending all items back to retail shelves immediately.",
                    "Selling them at scrap metal prices without testing."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 036: 'Hazardous or regulated goods require compliant handling.'"
            }
        ]
    },
    {
        "id": "mock-4",
        "title": "Mock Test 4: IT, Cloud, CyberSec & Telecom Scalability",
        "description": "Assess incident severity classifiers, cloud anomalies, least privilege, rate limiting, and network outage radii.",
        "durationMinutes": 15,
        "passScorePct": 70,
        "questions": [
            {
                "id": "m4_q1",
                "question": "In Incident Severity Classifier (Problem 045), what condition immediately triggers dedicated emergency escalation regardless of low user count?",
                "options": [
                    "A customer submitted a UI font suggestion.",
                    "A suspected security breach or unauthorized root data exfiltration.",
                    "A batch job ran 10 seconds slower than average.",
                    "An employee forgot their laptop charger."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 045: 'A suspected security breach follows a dedicated escalation path.'"
            },
            {
                "id": "m4_q2",
                "question": "In API Rate-Limit Protection (Problem 050), what design prevents penalizing legitimate clients experiencing temporary network retries?",
                "options": [
                    "Never imposing any rate limits on any client.",
                    "Differentiating burst credit allowances, token buckets, and accommodating transient clock skews before issuing permanent blocks.",
                    "Blocking any IP address that sends more than 2 requests per minute.",
                    "Redirecting all traffic to an unencrypted endpoint."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 050: 'Avoid penalising legitimate traffic due to clock skew or retry storms.'"
            },
            {
                "id": "m4_q3",
                "question": "In Access Review and Least Privilege (Problem 047), what must occur before revoking administrative access from a production engineer?",
                "options": [
                    "Delete the employee's entire email and laptop account immediately.",
                    "Enforce a controlled approval workflow, documented recovery procedure, and notification to avoid breaking production deployments.",
                    "Revoke access silently at midnight.",
                    "Transfer all admin rights to an external contractor."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 047: 'Never remove critical access without a controlled approval and recovery process.'"
            },
            {
                "id": "m4_q4",
                "question": "In Backup Recovery Readiness (Problem 049), why is a 'Backup Succeeded' green checkmark insufficient proof of recovery readiness?",
                "options": [
                    "Because backup disks are always corrupt.",
                    "A successful backup job is not proof that data restoration and database integrity tests will actually succeed under RTO/RPO targets.",
                    "Because cloud providers delete backups after 2 hours.",
                    "Because databases cannot be restored without internet access."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 049: 'A successful backup job is not proof that restoration works.' Regular automated restore drill tests are mandatory."
            },
            {
                "id": "m4_q5",
                "question": "In Cloud Cost Anomaly Detector (Problem 046), what must the system account for to avoid false alarm surges?",
                "options": [
                    "Known cloud provider billing ingestion delays and planned new microservice release deployments.",
                    "Treating all daily cost increases as malicious crypto-mining.",
                    "Assuming all cloud instances are free on weekends.",
                    "Ignoring billing until the end of the year."
                ],
                "correctIndex": 0,
                "explanation": "Constraint 046: 'Account for billing delays and distinguish forecast from final invoice.'"
            },
            {
                "id": "m4_q6",
                "question": "In Telecom Network Outage Impact Estimator (Problem 085), what algorithmic deduplication is required?",
                "options": [
                    "Summing subscribers across every single cell sector without geographic intersection.",
                    "Avoiding double-counting subscribers whose mobile devices are reachable by overlapping neighbor cell towers in the same polygon.",
                    "Assuming each subscriber has 10 mobile SIM cards.",
                    "Only counting subscribers currently making a phone call."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 085: 'Avoid double-counting customers served by overlapping network elements.'"
            },
            {
                "id": "m4_q7",
                "question": "In Content Moderation Case Routing (Problem 088), how should user flagging reports be treated?",
                "options": [
                    "Any post with 3 reports is automatically deleted with user account banned.",
                    "Reports are signals, not definitive proof; high severity content is queued for human review with appeal preservation.",
                    "Reports are ignored completely.",
                    "Reports are publicly posted on the user's wall."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 088: 'Reports are signals, not proof; preserve appeal and human review.'"
            },
            {
                "id": "m4_q8",
                "question": "In Digital Ad Pacing Controller (Problem 089), why shouldn't an ad campaign spend 100% of its budget in the first 2 hours of the day?",
                "options": [
                    "Because ad servers overheat.",
                    "To ensure consistent target audience coverage across all peak operational dayparts and honor client budget constraints.",
                    "Because users only click ads after 10 PM.",
                    "Because bids must always be $0.01."
                ],
                "correctIndex": 1,
                "explanation": "Pacing algorithms spread bids to ensure exposure across high-converting hours while staying within daily budget caps."
            },
            {
                "id": "m4_q9",
                "question": "In Subscription Entitlement Reconciliation (Problem 090), how must payment webhook retries be handled?",
                "options": [
                    "Process each incoming webhook as a new payment, giving users double duration.",
                    "Handle webhooks idempotently using payment event IDs to avoid incorrect state changes.",
                    "Reject all webhooks that arrive later than 1 second.",
                    "Charge the user's card twice on every webhook."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 090: 'Handle delayed webhooks idempotently and preserve an audit trail.'"
            },
            {
                "id": "m4_q10",
                "question": "In Creator Payout Reconciliation (Problem 092), what breakdown must be explicitly provided on the creator statement?",
                "options": [
                    "A single final dollar number with no explanation.",
                    "Clear separation of gross earnings, invalid-traffic deductions, withholding tax, and net payable balance.",
                    "Only the views count with no currency conversion.",
                    "A random percentage based on company profit."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 092: 'Explain adjustments and keep gross, deductions, and net amounts separate.'"
            }
        ]
    },
    {
        "id": "mock-5",
        "title": "Mock Test 5: EdTech, HR & Enterprise Workflow Logic",
        "description": "Assess skill gap analytics, at-risk student triage, certificate verification, workforce capacity, and meeting action follow-through.",
        "durationMinutes": 15,
        "passScorePct": 70,
        "questions": [
            {
                "id": "m5_q1",
                "question": "In Placement Readiness Gap Analysis (Problem 037), what is the core architectural instruction regarding learner scoring?",
                "options": [
                    "Condense all assessments into one single integer score between 1 and 100.",
                    "Do not reduce readiness to one aggregate score; explain actionable evidence for each specific skill gap (coding, communication, projects).",
                    "Only evaluate learners on their college CGPA.",
                    "Randomize interview readiness based on seat availability."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 037: 'Do not reduce readiness to one score; explain evidence for each gap.'"
            },
            {
                "id": "m5_q2",
                "question": "In Student At-Risk Support Queue (Problem 038), what is the ethical and operational directive for the risk flag?",
                "options": [
                    "Use the flag to publicly shame students in class rankings.",
                    "Use the flag to immediately expel struggling students.",
                    "Use the flag to offer proactive, supportive mentoring outreach, not to label or penalize learners.",
                    "Sell student risk data to third-party advertisers."
                ],
                "correctIndex": 2,
                "explanation": "Constraint 038: 'Use the flag to offer help, not to label or punish students.'"
            },
            {
                "id": "m5_q3",
                "question": "In Certificate Eligibility and Verification (Problem 042), what creates an auditable credential that cannot be forged?",
                "options": [
                    "A plain JPEG image with the student's name in bold.",
                    "A cryptographically hashed verifiable certificate reference tied to authorized completion records in the database.",
                    "An email saying 'Congratulations' with no record.",
                    "A verbal promise from the instructor."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 042: 'Only authorised approvals can issue or revoke credentials' with a verifiable unique reference."
            },
            {
                "id": "m5_q4",
                "question": "In Workforce Capacity Forecast (Problem 093), how must pipeline project demand be treated compared to active engagements?",
                "options": [
                    "Assume all prospective pipeline deals will 100% sign tomorrow.",
                    "Strictly separate confirmed availability from tentative assignments and weight unclosed opportunities by probability.",
                    "Ignore confirmed projects and staff only proposals.",
                    "Assign every employee to 5 full-time jobs simultaneously."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 093: 'Separate confirmed availability from tentative assignments.'"
            },
            {
                "id": "m5_q5",
                "question": "In Payroll Exception Reconciliation (Problem 094), what security and integrity boundary must never be broken?",
                "options": [
                    "Silently round down overtime hours to save company money.",
                    "Protect employee personal data and never silently alter pay inputs; all variances require documented auditable adjustments.",
                    "Publish all employee salaries in a public Slack channel.",
                    "Pay everyone in cryptocurrency with no records."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 094: 'Protect personal data and never silently alter pay inputs.'"
            },
            {
                "id": "m5_q6",
                "question": "In Recruitment Pipeline Bottleneck (Problem 095), what is the legal and ethical boundary in candidate ranking algorithms?",
                "options": [
                    "Using age, gender, zip code, or protected demographic proxies to screen candidates.",
                    "Never using protected characteristics or proxies to rank candidates; measure only skill competence, interview SLAs, and turnaround times.",
                    "Ranking candidates strictly based on their social media follower count.",
                    "Automating rejection based on zodiac signs."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 095: 'Do not use protected characteristics or proxies to rank candidates.'"
            },
            {
                "id": "m5_q7",
                "question": "In Expense Policy Checker (Problem 097), how should an expense exceeding the dinner allowance by $5 be handled?",
                "options": [
                    "Immediately report the employee to local police for criminal fraud.",
                    "Flag the variance for review and supervisor approval rather than automatically accusing fraud.",
                    "Deduct 100% of the employee's monthly salary.",
                    "Automatically approve the expense with no questions."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 097: 'Flag exceptions for review rather than automatically accusing fraud.'"
            },
            {
                "id": "m5_q8",
                "question": "In Meeting Action Follow-Through (Problem 100), what must the engine do if a meeting note mentions 'We should fix the server' but specifies no person or date?",
                "options": [
                    "Assign the task to the CEO and set deadline for tonight.",
                    "Do not infer an owner or deadline when none was agreed; flag as an unassigned pending item for chair clarification.",
                    "Mark the action item as completed.",
                    "Delete the server."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 100: 'Do not infer an owner or deadline when none was agreed.'"
            },
            {
                "id": "m5_q9",
                "question": "In Adaptive Practice Question Selector (Problem 039), what prevents learner burnout and frustration?",
                "options": [
                    "Giving the exact same failed question 50 times in a row.",
                    "Avoiding excessive repetition, recommending prerequisite remediation when fundamental concepts fail, and allowing elective branch changes.",
                    "Increasing the difficulty to PhD level whenever an answer is wrong.",
                    "Locking the browser for 48 hours after a wrong answer."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 039: 'Avoid repeating identical questions excessively; allow a learner to request a different path.'"
            },
            {
                "id": "m5_q10",
                "question": "In Campus Placement Slot Scheduler (Problem 044), what constitutes a critical scheduling conflict?",
                "options": [
                    "An interview scheduled on a sunny day.",
                    "Any double-booking where a candidate or a recruiter is scheduled for two interviews simultaneously.",
                    "Interviews scheduled in the afternoon.",
                    "Candidates who have different GPA scores."
                ],
                "correctIndex": 1,
                "explanation": "Constraint 044: 'No student or recruiter may be double-booked.'"
            }
        ]
    }
]

FINAL_ASSESSMENT = {
    "id": "final-assessment",
    "title": "Grand Final Assessment: Certified Industry Logic Architect",
    "description": "Comprehensive 20-question capstone examination spanning all 12 domains. Minimum score of 75% required to earn the Kapil's Certified Industry Logic Master Certificate.",
    "durationMinutes": 30,
    "passScorePct": 75,
    "questions": [
        {
            "id": "fa_q1",
            "domain": "Banking, FinTech & Insurance",
            "question": "According to the Evaluation Rubric (100 marks) in the industry problem bank, which section carries the highest allocation of marks (25 marks)?",
            "options": [
                "Problem interpretation",
                "Business rules & assumptions",
                "Logic quality (correct sequence, conditions, loops, priorities, and decision paths)",
                "Edge cases & test cases"
            ],
            "correctIndex": 2,
            "explanation": "Rubric Page 3 allocates 25 marks to Logic Quality (Correct sequence, conditions, loops, priorities, and decision paths), followed by Pseudocode clarity (20 marks)."
        },
        {
            "id": "fa_q2",
            "domain": "Banking, FinTech & Insurance",
            "question": "In Insurance Claim Prioritisation (Problem 004), what does classifying a claim as 'High Priority' signify?",
            "options": [
                "The claim is fraudulent and must be rejected immediately.",
                "The claim requires expedited, faster review to meet SLA deadlines, NOT automatic rejection or fraud classification.",
                "The insurer will pay out double the claimed amount.",
                "The policyholder's account will be canceled."
            ],
            "correctIndex": 1,
            "explanation": "Constraint 004 explicitly states: 'High priority means faster review, not automatic rejection or fraud classification.'"
        },
        {
            "id": "fa_q3",
            "domain": "Healthcare, Hospitals & Pharma",
            "question": "In Pharmacy Stockout Prevention (Problem 013), why is FEFO (First-Expiry-First-Out) strictly enforced over FIFO (First-In-First-Out)?",
            "options": [
                "Because medicines arriving later might possess an earlier expiration date due to distributor shelf residence.",
                "Because newer medicines always cost more money.",
                "Because hospital accountants prefer alphabetical sorting.",
                "Because FIFO is illegal in all commercial stores."
            ],
            "correctIndex": 0,
            "explanation": "In pharmaceuticals, medicines that expire earliest must be dispensed first (FEFO) to avoid expired stock wastage and patient toxicity."
        },
        {
            "id": "fa_q4",
            "domain": "Healthcare, Hospitals & Pharma",
            "question": "In Appointment No-Show Risk (Problem 011), how must a high no-show risk score be operationalized?",
            "options": [
                "Deny the patient their appointment and give the slot to another patient.",
                "Trigger supportive multi-channel reminders and transportation assistance; never use the score to deny healthcare.",
                "Charge the patient an upfront penalty fee before treatment.",
                "Cancel the doctor's shift."
            ],
            "correctIndex": 1,
            "explanation": "Constraint 011: 'Never use the score to deny care; design a supportive reminder workflow.'"
        },
        {
            "id": "fa_q5",
            "domain": "Retail, E-commerce & Consumer Goods",
            "question": "In Marketplace Seller SLA Monitor (Problem 025), which scenario should be categorized under an SLA exclusion rather than a seller penalty?",
            "options": [
                "Seller packed the box 3 days after deadline.",
                "Severe regional weather blizzard leading to postal courier station shutdown after on-time handover by seller.",
                "Seller went on holiday without setting store to vacation mode.",
                "Seller ran out of inventory."
            ],
            "correctIndex": 1,
            "explanation": "Constraint 025: 'Handle cancellations and carrier delays under clearly defined exclusions.' Carrier force-majeure events must not penalize sellers."
        },
        {
            "id": "fa_q6",
            "domain": "Retail, E-commerce & Consumer Goods",
            "question": "In Expiry and Markdown Optimiser (Problem 026), what prevents a perishable grocery item from being sold past safe limits?",
            "options": [
                "Applying product-specific minimum remaining shelf-life rules (e.g. pulled from sale 48h before expiry for donation).",
                "Selling at 99% discount even on the expiry day.",
                "Changing the expiration label in the warehouse.",
                "Freezing all milk and yogurt indefinitely."
            ],
            "correctIndex": 0,
            "explanation": "Constraint 026: 'Apply product-specific minimum remaining-life rules.' Food safety regulations prohibit retail sale past thresholds."
        },
        {
            "id": "fa_q7",
            "domain": "Manufacturing, Supply Chain & Logistics",
            "question": "In Predictive Maintenance Work Queue (Problem 032), how should critical safety sensor alarms be prioritized?",
            "options": [
                "Grouped into routine quarterly maintenance planning.",
                "Separated into immediate emergency safety shutdowns, bypassing routine cost-optimization queues.",
                "Ignored until the next shift change.",
                "Resetting the sensor remotely."
            ],
            "correctIndex": 1,
            "explanation": "Constraint 032: 'Separate urgent safety shutdowns from routine maintenance optimisation.'"
        },
        {
            "id": "fa_q8",
            "domain": "Education, EdTech & Workforce Development",
            "question": "In Training Attendance Reconciliation (Problem 040), when an erroneous biometric check-in is corrected by an instructor, what is mandatory?",
            "options": [
                "The student's password must be reset.",
                "An immutable, auditable reason and timestamped log must be recorded for every manual correction.",
                "The classroom camera footage must be deleted.",
                "All other students must be marked absent."
            ],
            "correctIndex": 1,
            "explanation": "Constraint 040: 'Retain an auditable reason for every correction.' Prevents fraudulent attendance alterations."
        },
        {
            "id": "fa_q9",
            "domain": "Education, EdTech & Workforce Development",
            "question": "In Learning Content Version Control (Problem 043), what must happen to students who already graduated under Version 1.0 when Version 2.0 is published?",
            "options": [
                "Their certificates are revoked until they retake the new course.",
                "Historical course versions and completed results are preserved; completed credentials must not be silently rewritten or invalidated.",
                "Their accounts are deleted.",
                "They are billed an upgrade fee automatically."
            ],
            "correctIndex": 1,
            "explanation": "Constraint 043: 'Keep historical versions and do not silently rewrite completed results.'"
        },
        {
            "id": "fa_q10",
            "domain": "IT, SaaS, Cybersecurity & Cloud Operations",
            "question": "In Security Patch Prioritisation (Problem 048), what should be done if an emergency vendor patch is known to crash production operating systems?",
            "options": [
                "Install it immediately regardless of crash risk.",
                "Define an emergency exception, implement verified compensating perimeter controls (e.g. WAF rules, network isolation), and test staging stability.",
                "Disable all firewalls.",
                "Turn off the database permanently."
            ],
            "correctIndex": 1,
            "explanation": "Constraint 048: 'Define emergency exceptions and document compensating controls.' Operational continuity requires mitigation without catastrophic self-inflicted outages."
        },
        {
            "id": "fa_q11",
            "domain": "IT, SaaS, Cybersecurity & Cloud Operations",
            "question": "In Help Desk Ticket Routing (Problem 052), which ticket type strictly bypasses normal agent queue loads and tier rankings?",
            "options": [
                "Tickets from users asking about dark mode.",
                "Urgent active security breaches or immediate life safety incidents.",
                "Password reset requests.",
                "Billing address update inquiries."
            ],
            "correctIndex": 1,
            "explanation": "Constraint 052: 'Urgent safety/security incidents bypass normal queue ranking.'"
        },
        {
            "id": "fa_q12",
            "domain": "Government, Public Services & Smart Cities",
            "question": "In Emergency Resource Dispatch (Problem 058), who possesses ultimate veto and operational authority over algorithmic suggestions?",
            "options": [
                "The server operating system kernel.",
                "Human dispatch commanders and field incident chiefs; safety constraints take precedence.",
                "The lowest-bidding software vendor.",
                "The emergency vehicle GPS navigation chip."
            ],
            "correctIndex": 1,
            "explanation": "Constraint 058: 'Human dispatch authority and safety constraints take precedence.'"
        },
        {
            "id": "fa_q13",
            "domain": "Energy, Utilities & Sustainability",
            "question": "In Electricity Load Forecast Alert (Problem 061), what critical distinction must operators maintain regarding projected power numbers?",
            "options": [
                "Forecast values must never be treated as physical measured demand; confidence intervals and capacity reserves must be factored.",
                "Forecast values are guaranteed contractual truths.",
                "Power lines only conduct energy when forecasted.",
                "Forecast models have 0% margin of error."
            ],
            "correctIndex": 0,
            "explanation": "Constraint 061: 'Do not treat forecast values as measured demand.' Relying on point forecasts without reserves leads to blackouts."
        },
        {
            "id": "fa_q14",
            "domain": "Travel, Hospitality, Aviation & Mobility",
            "question": "In Hotel Overbooking Risk Control (Problem 069), which category of guest reservations is strictly protected from oversell displacement?",
            "options": [
                "Single-night business travellers with no baggage.",
                "Confirmed accessible rooms for guests with disabilities and contractual VIP guarantee blocks.",
                "Guests who checked in via a third-party discount app.",
                "Walk-in reservations."
            ],
            "correctIndex": 1,
            "explanation": "Constraint 069: 'Protect confirmed accessible-room and contractual requirements.' Inaccessible displacement violates disability laws."
        },
        {
            "id": "fa_q15",
            "domain": "Travel, Hospitality, Aviation & Mobility",
            "question": "In Airline Disruption Rebooking (Problem 071), what constraint prevents creating stranded passengers during itinerary rebooking?",
            "options": [
                "Ensuring connecting layovers strictly honor Minimum Connection Times (MCT) and accommodate passenger accessibility needs.",
                "Giving passengers only 5 minutes between international connecting flights.",
                "Sending luggage to a completely different continent.",
                "Rebooking passengers only on flights departing next week."
            ],
            "correctIndex": 0,
            "explanation": "Constraint 071: 'Respect minimum connection times and accessibility requirements.'"
        },
        {
            "id": "fa_q16",
            "domain": "Agriculture, Food Systems & Rural Enterprise",
            "question": "In Milk Collection Route and Quality Gate (Problem 081), what is the mandatory protocol if a farm bulk tank tests positive for antibiotics?",
            "options": [
                "Pump it into the collection tanker immediately to dilute it.",
                "Strict hold and immediate rejection procedure; contaminated milk must never enter the human dairy supply chain.",
                "Boil the milk at the farm.",
                "Offer a 10% discount to consumers."
            ],
            "correctIndex": 1,
            "explanation": "Constraint 081: 'Failed or pending quality checks must follow approved hold/reject procedures.' Antibiotics ruin fermentation and violate food laws."
        },
        {
            "id": "fa_q17",
            "domain": "Agriculture, Food Systems & Rural Enterprise",
            "question": "In Food Traceability Recall (Problem 082), what defines a complete, compliant recall scope?",
            "options": [
                "Recalling only the single physical box returned by a complaining customer.",
                "Identifying both confirmed tainted lots and all potentially exposed cross-contaminated batches with an auditable forward-and-backward genealogy.",
                "Hiding the batch numbers from regulatory inspectors.",
                "Issuing store coupons instead of recalling food."
            ],
            "correctIndex": 1,
            "explanation": "Constraint 082: 'Identify confirmed and potentially affected lots, with an auditable recall scope.'"
        },
        {
            "id": "fa_q18",
            "domain": "Telecom, Media & Digital Platforms",
            "question": "In Telecom Churn Intervention Queue (Problem 086), why are sensitive demographic attributes prohibited from retention algorithms?",
            "options": [
                "Because servers cannot process text.",
                "To prevent unlawful demographic redlining and privacy violations; outreach must rely strictly on usage drops, complaints, and explicit marketing consent.",
                "Because telecom companies don't care about customer retention.",
                "Because everyone uses the same mobile phone."
            ],
            "correctIndex": 1,
            "explanation": "Constraint 086: 'Respect consent and avoid using sensitive proxies.'"
        },
        {
            "id": "fa_q19",
            "domain": "HR, Professional Services & Enterprise Operations",
            "question": "In Consulting Project Margin Watch (Problem 099), what is the primary purpose of early alert triggers?",
            "options": [
                "To fire all developers on the project immediately.",
                "To alert management to cost-margin erosion while project phases can still be remediated, before cost overruns become irreversible.",
                "To bill the client 5 times higher fees without notice.",
                "To celebrate project success early."
            ],
            "correctIndex": 1,
            "explanation": "Constraint 099: 'Show assumptions and alert before overruns become irreversible.'"
        },
        {
            "id": "fa_q20",
            "domain": "Cross-Industry Submission Standards",
            "question": "According to the Final Submission Checklist on Page 16, what standard must every student pseudocode fulfill?",
            "options": [
                "It must be written in proprietary machine assembly language.",
                "Another engineer or student should be able to implement the pseudocode without guessing, covering normal paths, edge cases, and compliance boundaries.",
                "It must contain fewer than 3 lines of code.",
                "It must rely on unstated hidden assumptions."
            ],
            "correctIndex": 1,
            "explanation": "Page 16 Final Submission Checklist: 'Another student should be able to implement my pseudocode without guessing. Think like an engineer. Reason like an analyst. Design for the real world.'"
        }
    ]
}

def main():
    out_dir = r"C:\Users\LC\.gemini\antigravity\scratch\kapil-logic-vault-100\js"
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "data-tests.js")
    
    js_content = "// ==========================================================================\n"
    js_content += "// KAPIL'S LOGIC-VAULT 100: Mock Tests & Grand Final Assessment\n"
    js_content += "// 5 Domain-Specific Mock Tests + 1 Grand Comprehensive Final Exam\n"
    js_content += "// Powered By Kapil • SarlaYash Learning Solutions LLP\n"
    js_content += "// ==========================================================================\n\n"
    js_content += "const ALL_MOCK_TESTS = " + json.dumps(MOCK_TESTS, indent=2) + ";\n\n"
    js_content += "const GRAND_FINAL_ASSESSMENT = " + json.dumps(FINAL_ASSESSMENT, indent=2) + ";\n\n"
    js_content += "if (typeof module !== 'undefined' && module.exports) {\n"
    js_content += "    module.exports = { ALL_MOCK_TESTS, GRAND_FINAL_ASSESSMENT };\n"
    js_content += "}\n"
    
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(js_content)
        
    print(f"Successfully generated tests to {out_file}")

if __name__ == "__main__":
    main()
