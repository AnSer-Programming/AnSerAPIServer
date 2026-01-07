// businessReasons.js
// This file mirrors the provided business_reasons_master.json structure.
const BUSINESS_REASONS = {
  "HVAC (heating, ventilation, air conditioning)": {
    client_facing: [
      "No A/C / A/C not cooling",
      "No heat / furnace not working",
      "Gas / CO / detector alarm",
      "HVAC service / after hours",
      "Boiler / water heater / no hot water",
      "Refrigeration / walk-in / cooler not cooling",
      "HVAC controls / thermostat issue"
    ]
  },
  "Property Management / Rentals": {
    client_facing: [
      "Lockout / can\u2019t get in",
      "Elevator issue / stuck in elevator",
      "Water issue (no water / no hot water)",
      "Toilet / sewer backup / flooding",
      "Leak / active water coming in",
      "Maintenance request (non-emergency)",
      "Safety / security issue",
      "Noise / tenant / rental inquiry",
      "Parking / gate / garage issue",
      "Appliance not working"
    ]
  },
  "Construction / Contracting": {
    client_facing: [
      "Requesting an estimate / bid",
      "Inspection / Digger\u2019s Hotline / One Call",
      "Roof leak / building leak",
      "Plumbing service (incl. water/sewer)",
      "Electrical service",
      "Gas odor / gas smell",
      "Compactor / equipment issue",
      "Porta potty service",
      "Building / site emergency",
      "New construction / remodel"
    ]
  },
  "Landscaping / Tree / Snow Removal": {
    client_facing: [
      "Snow plowing / snow removal",
      "Ice / snow hazard on property",
      "Tree down / emergency tree work",
      "Storm damage (yard / exterior)",
      "Sprinkler / irrigation issue",
      "Exterior / street / lot lighting issue"
    ]
  },
  "Medical / Healthcare (hospitals, clinics)": {
    client_facing: [
      "Patient calling for provider / doctor",
      "Family or caregiver calling for a patient",
      "Admission / ED / transfer / bed request",
      "Nursery / newborn report",
      "Page on-call doctor / nurse / provider / consult",
      "Triage / nurse line follow-up (care will call back / care declined)",
      "Prescription / RX / pharmacy / medication refill",
      "Labs / test / diagnostic / critical results",
      "Surgery / procedure / OR / anesthesia / donor services",
      "Hospice / palliative care / home health",
      "Behavioral / psych / safety concern",
      "Clinic / office / department calling",
      "Hospital / medical facility calling",
      "Facility emergency \u2013 water / leak / sewer / flood",
      "Facility equipment \u2013 refrigerator / freezer / walk-in / med fridge",
      "Facility utilities \u2013 power out / no power / HVAC / building issue",
      "Elevator / building access (hospital/facility)",
      "Transport / driver / courier / supplies / delivery for facility",
      "Medical supply / DME / vendor / outside medical org",
      "Insurance / billing / authorization / referral info",
      "Spiritual / parish / clergy / church-related for patient",
      "Death / medical examiner (OMI) / fetal demise / funeral info",
      "Program / special facility calls",
      "Telemarketer / non-patient call",
      "Other / office message / not sure \u2013 take a message"
    ]
  },
  "Funeral Home / Mortuary Services": {
    client_facing: [
      "Death call / removal needed",
      "Notice of death (facility / hospice / ME)",
      "Enter / update funeral arrangements",
      "Pre-arrangements / preneed",
      "Obituary / memorial / remembrance request",
      "Funeral home / cemetery / vendor calling",
      "Cremation / pet cremation"
    ]
  },
  "Veterinary / Animal Services": {
    client_facing: [
      "Animal emergency / injured / abused",
      "Stray / lost / found animal",
      "Wildlife / animal in building or unit",
      "Pet death / euthanasia / cremation",
      "Urgent / after-hours vet (small or large animal)",
      "Clinic / location / on-call change",
      "Boarding / kennel / animal care question",
      "Other / message for the clinic"
    ]
  },
  "Insurance / Claims / Risk": {
    client_facing: [
      "Report a new claim / loss",
      "Update / ask about an existing claim",
      "Property damage / property loss / flood",
      "Auto / vehicle accident or damage (incl. RV / Semi)",
      "Injury / worker\u2019s comp / liability",
      "Business / commercial / general liability claim",
      "Theft / stolen property",
      "Spill / leak / accident / fire",
      "Bond or specialty claim",
      "Other claim-related message"
    ]
  },
  "Legal / Law Enforcement / Compliance": {
    client_facing: [
      "Law enforcement / police / sheriff calling",
      "Court / judge / chambers / probation / parole",
      "Attorney / legal counsel calling about a case",
      "Protective services / CPS / APS / DHS / OIG",
      "Compliance / reporting / incident",
      "Suspicious or criminal activity",
      "Police / fire / 911 urgent call",
      "Other legal / court message"
    ]
  },
  "Logistics / Transportation / Delivery / Towing": {
    client_facing: [
      "Delivery / pickup status (ETA / late / missed)",
      "Driver calling in (directions / can\u2019t access / after hours)",
      "Fuel card / fuel for truck / equipment",
      "Towing / vehicle / truck broke down",
      "Can\u2019t access site / gate / dock / after hours delivery",
      "Reschedule / wrong location / wrong product",
      "Freight / load / trailer / paperwork issue",
      "Transport for person / patient / facility",
      "Accident / spill / incident involving vehicle",
      "Other logistics / dispatch message"
    ]
  },
  "IT / Telecom / Software / Network": {
    client_facing: [
      "General tech support / help desk",
      "Can\u2019t log in (portal / LMS / Canvas / app)",
      "Internet / network / Wi\u2011Fi / VPN down",
      "Phone / VoIP / email issue",
      "Application / software issue (OnCue, Wireguide, monitoring, EMR)",
      "API / integration (test or turn on/off)",
      "Server / domain / data center issue",
      "Other IT / non-tech support message"
    ]
  },
  "Manufacturing / Industrial / Equipment": {
    client_facing: [
      "Parts / replacement parts / urgent parts",
      "Equipment down / malfunction / mechanical issue",
      "Pump / motor / transformer not working",
      "Industrial service / maintenance request",
      "Crane / lift / heavy equipment (rent or schedule)",
      "Bulk fuel / diesel / oil / factory fluids",
      "Warehouse / plant / distribution center call",
      "Other manufacturing / plant message"
    ]
  },
  "Misc / Unlisted / Other.": {
    client_facing: [
      "General message / caller didn\u2019t say",
      "Returning a call / follow-up on earlier call",
      "Wrong number / not our department",
      "Sales / vendor / telemarketing",
      "Employee / HR / staffing / call-in",
      "Billing / payment / invoice / statement",
      "Appointment / scheduling / cancel / reschedule",
      "Info request (hours / address / directions)",
      "Website / portal / email issue",
      "Church / school / community / donation",
      "Test / QA / admin call",
      "Other (not listed)"
    ]
  }
};

export default BUSINESS_REASONS;
