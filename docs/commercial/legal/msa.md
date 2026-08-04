# MESvantage Master Subscription Agreement

> DRAFT v0.1 — for review by Irish counsel before use. Bracketed [items] require a decision or company detail.

**Parties:**

1. **MESvantage Limited**, a private company limited by shares incorporated in Ireland under company number [CRO number], with its registered office at [registered office] ("**MESvantage**"); and

2. The customer identified in the applicable Order Form ("**Customer**").

This Master Subscription Agreement, together with each Order Form, the Data Processing Agreement, and the Service Level Agreement (together, the "**Agreement**"), governs the Customer's subscription to the MESvantage Platform. In the event of conflict, the order of precedence is: (1) the Order Form; (2) this Master Subscription Agreement; (3) the Data Processing Agreement; (4) the Service Level Agreement.

---

## 1. Definitions

1.1 "**Affiliate**" means an entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of more than 50% of voting interests or the power to direct management.

1.2 "**AI Assistant**" means the optional AI-assisted drafting and query features of the Platform, which operate on a read-and-draft basis only, cannot approve, release, or electronically sign any record, and do not use Customer Data to train any model.

1.3 "**Confidential Information**" means all information disclosed by one party to the other that is marked confidential or would reasonably be regarded as confidential, including (in the case of MESvantage) the Platform, its documentation, roadmap, and pricing, and (in the case of the Customer) the Customer Data.

1.4 "**Customer Data**" means all data, records, and content uploaded to, entered into, or generated within the Customer's dedicated Deployment by or on behalf of the Customer, including device history records, genealogy and traceability records, inspection and quality records, and user and training records.

1.5 "**Deployment**" means the dedicated, single-customer instance of the Platform provisioned for the Customer, comprising separate compute, database, and storage, as further described in clause 5.

1.6 "**Documentation**" means MESvantage's user and administration documentation for the Platform, as updated from time to time.

1.7 "**Effective Date**" means the date of the first Order Form, unless otherwise stated in the Order Form.

1.8 "**Implementation Services**" means the installation, configuration, data migration, integration, training, and validation-support services described in clause 4 and the applicable Order Form.

1.9 "**Intellectual Property Rights**" means all patents, rights to inventions, copyright and related rights, trade marks, trade names, rights in designs, database rights, rights in confidential information (including know-how), and all other intellectual property rights, whether registered or unregistered, anywhere in the world.

1.10 "**Order Form**" means an ordering document executed by both parties referencing this Agreement, specifying the Site(s), Tier, Subscription Fees, Implementation Fees, and term.

1.11 "**Platform**" means the MESvantage manufacturing execution system software, including modules for device history records (DHR), genealogy and traceability, OEE, FAI/inspections, NCR/CAPA, scheduling, audit trail, electronic signatures, the AI Assistant, and OEM customer portals, together with updates and the Documentation.

1.12 "**Service Level Agreement**" or "**SLA**" means MESvantage's service level agreement in force from time to time, referenced in Schedule 3.

1.13 "**Site**" means a single physical manufacturing facility of the Customer identified in an Order Form.

1.14 "**Subscription Fees**" means the recurring annual fees for the Subscription, as set out in the Order Form.

1.15 "**Subscription Term**" means the initial term and any renewal terms described in clause 16.

1.16 "**Tier**" means the subscription tier (Essential, Professional, or Enterprise) selected in the Order Form, with features as described in the Documentation or the Order Form.

1.17 "**Validation Package**" means the IQ/OQ/PQ protocol templates, test scripts, requirements traceability matrix, and executed reference evidence supplied by MESvantage as described in clause 8.

---

## 2. Subscription Grant

2.1 Subject to the terms of this Agreement and payment of the Subscription Fees, MESvantage grants the Customer a non-exclusive, non-transferable (except under clause 20.4) right, during the Subscription Term, for the Customer's and its Affiliates' employees and contractors to access and use the Platform and Documentation for the Customer's internal business purposes at the licensed Site(s).

2.2 Subscriptions are licensed **per Site**. Each Site requires its own subscription as specified in an Order Form. There are no per-user fees: the Customer may grant access to an unlimited number of its users at a licensed Site, subject to clause 2.3.

2.3 The Customer is responsible for its users' compliance with this Agreement and for maintaining the confidentiality of access credentials. Access may not be shared with third parties (other than the Customer's contractors bound by obligations at least as protective as this Agreement), except through the OEM customer portal functionality, which the Customer may make available to its own customers as contemplated by the Documentation.

2.4 The Customer must not: (a) copy, modify, translate, or create derivative works of the Platform; (b) reverse engineer, decompile, or disassemble the Platform, except to the extent prohibited by applicable law; (c) rent, lease, sell, or sublicense the Platform; (d) circumvent security or access controls; or (e) use the Platform to build a competing product.

---

## 3. Tiers, Fees and Payment

3.1 **Tiers.** Subscriptions are available in three Tiers, at current list prices per Site per year of: Essential €32,000; Professional €58,000; Enterprise €95,000. The applicable Tier, any discounts, and the final Subscription Fees are as stated in the [Order Form].

3.2 **Implementation Fees.** One-time Implementation Services fees typically range from €12,000 to €35,000 depending on scope, and are as stated in the [Order Form]. Where the Customer previously paid a pilot evaluation fee and converts within [90 days] of the end of its trial period, that pilot fee is credited in full against the Implementation Fees.

3.3 **Infrastructure included.** Subscription Fees include hosting infrastructure for the Deployment as described in clause 5. No separate infrastructure charges apply unless stated in the [Order Form].

3.4 **Invoicing and payment.** Unless the Order Form states otherwise: (a) Subscription Fees are invoiced annually in advance; (b) Implementation Fees are invoiced [50%] on Order Form signature and [50%] on go-live; and (c) invoices are payable within [30 days] of invoice date. All fees are exclusive of VAT, which is payable in addition at the applicable rate.

3.5 **Late payment.** Overdue amounts bear interest at the rate provided by the Late Payment in Commercial Transactions Regulations 2012 (as amended) or, if lower, the maximum rate permitted by law.

3.6 **Fee changes.** MESvantage may adjust list prices for renewal terms by written notice at least [90 days] before the renewal date. Any increase for a renewal term will not exceed [the lesser of CPI or 5%] of the prior term's Subscription Fees, unless the Customer changes Tier or scope.

3.7 **Taxes.** Each party is responsible for its own taxes. If the Customer is required to withhold tax on any payment, it will gross up the payment so MESvantage receives the amount it would have received absent withholding.

---

## 4. Implementation Services

4.1 MESvantage will perform the Implementation Services described in the applicable Order Form, which may include Deployment provisioning, configuration, integration (including OPC-UA machine connectivity and ERP integration), data migration, administrator and end-user training, and Validation Package delivery and support.

4.2 Each party will cooperate in good faith and provide the resources, access, and decisions reasonably required. The Customer is responsible for the readiness of its own network, machines, and third-party systems.

4.3 Acceptance criteria and acceptance process for the Implementation Services: [to be defined in the Order Form].

---

## 5. Hosting and Deployment Architecture

5.1 **Dedicated deployment.** Each Customer Deployment is dedicated and single-tenant: separate compute, a separate database, and separate storage. Customer Data is not commingled with other customers' data at the application, database, or storage level.

5.2 **EU hosting.** Deployments are hosted in the European Union [confirm hosting provider and region]. Customer Data will not be hosted or stored outside the European Economic Area without the Customer's prior written consent.

5.3 **Changes.** MESvantage may change hosting providers or regions within the EEA, subject to the sub-processor change notice provisions of the Data Processing Agreement, and provided the level of protection is not materially reduced.

---

## 6. Service Levels

6.1 MESvantage will provide the Platform in accordance with the Service Level Agreement, which sets out availability targets, support hours, severity definitions, response and resolution targets, escalation, service credits, maintenance windows, and backup policy.

6.2 Service credits under the SLA are the Customer's sole and exclusive remedy for failures to meet the availability targets in the SLA, except where the failure constitutes a material breach of this Agreement.

---

## 7. Security and Audit Trail

7.1 MESvantage will maintain appropriate technical and organisational security measures, as described in Annex II of the Data Processing Agreement, including: dedicated Deployment isolation; role-based access control; encryption of Customer Data in transit and at rest; and security logging.

7.2 The Platform maintains a computer-generated, time-stamped audit trail of operator entries and actions that create, modify, or delete electronic records, as described in the Documentation. Audit trail records are retained for the Subscription Term and are exportable on exit under clause 17.

7.3 MESvantage will notify the Customer of any personal data breach affecting Customer Data in accordance with the Data Processing Agreement.

---

## 8. Electronic Signatures; Regulatory Responsibilities; Validation

8.1 **Part 11 acknowledgement.** The Platform provides electronic signature functionality designed to support the technical requirements of 21 CFR Part 11 and equivalent EU expectations, including unique user credentials, signature manifestation, signature-record linking, and audit trails.

8.2 **Customer responsibility.** The Customer acknowledges that regulatory compliance is a function of both the Platform and the Customer's own procedural controls. The Customer is solely responsible for: (a) its procedural and administrative controls (including credential management, training, and authority checks); (b) determining whether and how to use electronic signatures; and (c) the content and approval of all records. The AI Assistant cannot approve, release, or sign any record; all AI-drafted content must be reviewed and approved by the Customer's authorised personnel.

8.3 **Validation.** Validation of software for its intended use is the Customer's obligation under ISO 13485:2016 clause 4.1.6 and the FDA Quality Management System Regulation (QMSR), and no software supplier, including MESvantage, can discharge that obligation. MESvantage will: (a) supply the Validation Package (IQ/OQ/PQ protocol templates, test scripts, a requirements traceability matrix, and executed reference evidence); and (b) provide reasonable assistance with the Customer's validation activities during Implementation Services. MESvantage does not represent that the Platform is "FDA-validated", "FDA-approved", or "fully compliant" with any regulatory requirement.

8.4 **Regulatory inspections.** MESvantage will provide reasonable cooperation and documentation in connection with a regulatory inspection or notified-body audit of the Customer to the extent it relates to the Platform, at MESvantage's then-current rates [or: at no charge for the first [2] days per contract year — decide].

---

## 9. Customer Data

9.1 **Ownership.** As between the parties, the Customer owns all right, title, and interest in the Customer Data. MESvantage acquires no rights in Customer Data other than the limited right to host and process it to provide and support the Platform.

9.2 **Data processing.** The parties will comply with the Data Processing Agreement in Schedule 2, which governs MESvantage's processing of personal data on the Customer's behalf. MESvantage acts as processor for Customer Data; MESvantage acts as an independent controller for its own marketing, sales, and lead data.

9.3 **No training on Customer Data.** MESvantage does not use Customer Data to train any AI or machine learning model.

9.4 **Export.** The Customer may export Customer Data at any time using the Platform's export functionality. On expiry or termination, clause 17 (Exit Assistance) applies.

9.5 **Data quality and legality.** The Customer is responsible for the accuracy, quality, and legality of Customer Data and for having all necessary rights and lawful bases to provide it.

---

## 10. Sub-processors

10.1 MESvantage engages the sub-processors listed in the Data Processing Agreement (including its hosting provider) to deliver the Platform. MESvantage will give prior notice of changes to that list and handle objections in accordance with the Data Processing Agreement.

10.2 MESvantage remains liable for the acts and omissions of its sub-processors as for its own.

---

## 11. Confidentiality

11.1 Each party (the "**Receiving Party**") must keep the other party's (the "**Disclosing Party**") Confidential Information strictly confidential, use it only to perform or receive the benefit of this Agreement, and disclose it only to employees, contractors, Affiliates, and professional advisers who need to know it and are bound by confidentiality obligations at least as protective as this clause.

11.2 The obligations in clause 11.1 do not apply to information that: (a) is or becomes public other than through breach of this Agreement; (b) was lawfully known to the Receiving Party free of restriction before disclosure; (c) is received from a third party free of restriction; or (d) is independently developed without use of the Disclosing Party's Confidential Information.

11.3 The Receiving Party may disclose Confidential Information to the extent required by law, regulation, a court of competent jurisdiction, or a regulatory authority with jurisdiction over the Disclosing Party's products, provided (where lawful) it gives the Disclosing Party prompt notice and reasonable assistance.

11.4 These obligations continue during the Subscription Term and for [five (5) years] after expiry or termination, except for trade secrets, which are protected for as long as they remain trade secrets.

---

## 12. Intellectual Property

12.1 MESvantage (and its licensors, if any) owns all Intellectual Property Rights in the Platform, the Documentation, the Validation Package, and all improvements, updates, and derivatives of them. Nothing in this Agreement transfers any Intellectual Property Rights to the Customer.

12.2 The Customer owns all Intellectual Property Rights in the Customer Data.

12.3 If the Customer provides feedback, suggestions, or ideas ("**Feedback**"), the Customer grants MESvantage a perpetual, irrevocable, royalty-free licence to use that Feedback for any purpose without compensation.

12.4 Any bespoke configuration, integration, or report developed specifically for the Customer during Implementation Services: [option A — owned by MESvantage and licensed to the Customer for the Subscription Term; option B — assigned to the Customer on payment in full, excluding MESvantage's pre-existing IP and generic tools; decide].

---

## 13. Warranties and Disclaimer

13.1 **MESvantage warranties.** MESvantage warrants that: (a) the Platform will perform materially in accordance with the Documentation during the Subscription Term; (b) the Implementation Services will be performed with reasonable skill and care; and (c) it will not knowingly introduce malicious code into the Platform. The Customer's remedy for breach of clause 13.1(a) is that MESvantage will use commercially reasonable efforts to correct the non-conformity; if MESvantage cannot do so within [60 days] of notice, the Customer may terminate the affected Order Form and receive a pro-rata refund of prepaid, unused Subscription Fees.

13.2 **Customer warranties.** The Customer warrants that it has the rights and lawful bases necessary to provide Customer Data and that its use of the Platform will comply with applicable law.

13.3 **Disclaimer.** EXCEPT AS EXPRESSLY STATED IN THIS AGREEMENT, AND TO THE MAXIMUM EXTENT PERMITTED BY LAW, ALL OTHER WARRANTIES, CONDITIONS, AND TERMS IMPLIED BY STATUTE, COMMON LAW, OR OTHERWISE (INCLUDING SATISFACTORY QUALITY AND FITNESS FOR A PARTICULAR PURPOSE) ARE EXCLUDED. WITHOUT LIMITING CLAUSE 8, MESVANTAGE DOES NOT WARRANT THAT THE PLATFORM ALONE WILL MAKE THE CUSTOMER COMPLIANT WITH ANY REGULATORY REGIME.

13.4 The Customer confirms it is acting in the course of a business and not as a consumer.

---

## 14. Indemnities

14.1 **IP infringement indemnity (MESvantage).** MESvantage will defend the Customer against any third-party claim that the Customer's authorised use of the Platform infringes that third party's Intellectual Property Rights, and will indemnify the Customer against damages and costs finally awarded (or agreed in settlement), provided the Customer: (a) promptly notifies MESvantage in writing; (b) gives MESvantage sole control of the defence and settlement; and (c) provides reasonable cooperation. If the Platform is, or in MESvantage's opinion is likely to become, subject to such a claim, MESvantage may: (i) procure the right for the Customer to continue using it; (ii) modify or replace it so it is non-infringing without material loss of functionality; or (iii) if neither is commercially practicable, terminate the affected Order Form and refund prepaid, unused Subscription Fees. This clause does not apply to claims arising from: (A) Customer Data or Customer-provided materials; (B) use of the Platform in combination with items not provided by MESvantage, where the claim would not have arisen but for the combination; (C) modification of the Platform by anyone other than MESvantage; or (D) use in breach of this Agreement. This clause 14.1 states the Customer's exclusive remedy for IP infringement claims.

14.2 **Misuse indemnity (Customer).** The Customer will defend and indemnify MESvantage against third-party claims, losses, damages, costs, and expenses (including reasonable legal fees) arising from: (a) Customer Data, including any claim that Customer Data infringes third-party rights or data protection law; (b) the Customer's use of the Platform in breach of this Agreement or applicable law; or (c) any product manufactured, inspected, or released by the Customer (it being acknowledged that product quality and regulatory compliance of the Customer's products are the Customer's responsibility).

---

## 15. Limitation of Liability

15.1 Nothing in this Agreement excludes or limits either party's liability for: (a) death or personal injury caused by its negligence; (b) fraud or fraudulent misrepresentation; (c) the indemnities in clauses 14.1 and 14.2 [confirm whether indemnities sit outside the cap]; or (d) any liability that cannot be excluded or limited by law.

15.2 Subject to clause 15.1, neither party is liable for any: (a) loss of profits, revenue, business, anticipated savings, or goodwill; (b) loss or corruption of data (subject to MESvantage's backup obligations under the SLA); or (c) indirect, special, incidental, or consequential loss.

15.3 Subject to clauses 15.1 and 15.2, each party's total aggregate liability arising out of or in connection with this Agreement in any contract year is capped at an amount equal to the Subscription Fees paid or payable by the Customer in the twelve (12) months preceding the event giving rise to the claim (or, for events in the first contract year, the Subscription Fees payable for that year).

---

## 16. Term, Renewal, Termination and Suspension

16.1 **Term.** This Agreement begins on the Effective Date and continues until all Order Forms expire or are terminated. Each Order Form has an initial term of [one (1) year] from its start date unless stated otherwise.

16.2 **Renewal.** Each Order Form renews automatically for successive [one (1) year] terms unless either party gives written notice of non-renewal at least [60 days] before the renewal date.

16.3 **Termination for cause.** Either party may terminate this Agreement or the affected Order Form if the other: (a) commits a material breach that is not remedied within [30 days] of written notice; or (b) becomes insolvent, enters liquidation, examinership, receivership, or any analogous process.

16.4 **Suspension.** MESvantage may suspend the Platform: (a) if the Customer is more than [30 days] overdue on undisputed fees, after at least [14 days'] prior written notice; (b) where continued operation would create a genuine security risk or legal exposure; or (c) as permitted by the SLA for maintenance. Suspension does not relieve the Customer of payment obligations.

16.5 **Effect of termination.** On expiry or termination: (a) all rights of access end; (b) clause 17 (Exit Assistance) applies; and (c) accrued rights and clauses that by their nature should survive (including clauses 1, 9, 11, 12, 14, 15, 17, 19, 20, and 21) survive.

---

## 17. Exit Assistance

17.1 For [90 days] after expiry or termination (the "**Exit Period**"), MESvantage will: (a) make Customer Data, including audit trail records, available for export in [CSV/JSON plus PDF renderings of signed records — confirm export formats]; and (b) provide reasonable assistance with the export and with migration queries at its then-current rates [or: include up to [8] hours at no charge — decide].

17.2 Following the Exit Period, MESvantage will delete Customer Data in accordance with the Data Processing Agreement, except to the extent retention is required by law.

---

## 18. Force Majeure

18.1 Neither party is liable for failure or delay caused by events beyond its reasonable control, including acts of God, war, terrorism, pandemic, strikes, utility or telecommunications failures, and failures of third-party hosting providers that could not reasonably have been avoided ("**Force Majeure**"), provided the affected party promptly notifies the other and uses reasonable endeavours to mitigate.

18.2 If a Force Majeure event continues for more than [60 days], either party may terminate the affected Order Form on written notice, and MESvantage will refund prepaid, unused Subscription Fees.

---

## 19. Notices

19.1 Notices must be in writing and delivered by hand, by prepaid registered post, or by email: to MESvantage at hello@mesvantage.com and its registered office; to the Customer at the address in the Order Form. Notices are deemed received: by hand, on delivery; by post, [2] business days after posting; by email, at the time of transmission if no failure notification is received.

---

## 20. General

20.1 **Entire agreement.** This Agreement (with its Schedules and Order Forms) is the entire agreement between the parties and supersedes all prior arrangements relating to its subject matter. Neither party relies on any statement not set out in this Agreement, but nothing limits liability for fraudulent misrepresentation.

20.2 **Variation.** Changes to this Agreement must be in writing signed by both parties, except that MESvantage may update the SLA and the Data Processing Agreement as described in those documents, provided the level of protection is not materially reduced.

20.3 **Waiver and severability.** No failure or delay in exercising a right is a waiver. If any provision is held invalid or unenforceable, the remainder continues in force.

20.4 **Assignment.** Neither party may assign this Agreement without the other's prior written consent, except that either party may assign to an Affiliate or to a successor in connection with a merger, reorganisation, or sale of substantially all assets, on written notice. Any other purported assignment is void.

20.5 **No partnership.** Nothing in this Agreement creates a partnership, joint venture, or agency relationship.

20.6 **Counterparts and e-signature.** This Agreement and Order Forms may be executed in counterparts, including by electronic signature in accordance with the Electronic Commerce Act 2000 (as amended) and Regulation (EU) No 910/2014 (eIDAS), each of which is deemed an original.

---

## 21. Governing Law and Jurisdiction

21.1 This Agreement and any dispute or claim arising out of or in connection with it (including non-contractual disputes or claims) is governed by the laws of Ireland. The courts of Ireland have exclusive jurisdiction.

---

## Schedules

- **Schedule 1 — Order Form** [template to be prepared]: Site(s), Tier, Subscription Fees, Implementation Fees and milestones, start date, term, special terms.
- **Schedule 2 — Data Processing Agreement** (including Annex I processing details and Annex II technical and organisational measures).
- **Schedule 3 — Service Level Agreement.**

---

**Signatures:**

| | MESvantage Limited | Customer |
|---|---|---|
| Signature | ______________________ | ______________________ |
| Name | Patrick Byrnes | |
| Title | Founder & CEO | |
| Date | | |

*Contact: hello@mesvantage.com*
