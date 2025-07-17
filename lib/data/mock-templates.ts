import type { AuditTemplate } from "@/lib/types/audit-types"

export const mockTemplates: AuditTemplate[] = [
  {
    id: "template-1",
    title: "Health and Safety Audit",
    description: "Comprehensive health and safety assessment for workplace environments",
    photo: "/construction-site-safety-check.png",
    pages: [
      {
        id: "page-1",
        template_id: "template-1",
        title: "General Safety",
        description: "General workplace safety assessment",
        ordinal: 1,
        sections: [
          {
            id: "section-1",
            page_id: "page-1",
            title: "Hazard Identification",
            ordinal: 1,
            questions: [
              {
                id: "question-1",
                page_id: "page-1",
                section_id: "section-1",
                text: "Are all emergency exits clearly marked?",
                required: true,
                multiple_selection: false,
                is_flagged: true,
                field_type: "BOOLEAN",
                ordinal: 1,
              },
              {
                id: "question-2",
                page_id: "page-1",
                section_id: "section-1",
                text: "Are fire extinguishers easily accessible and regularly inspected?",
                required: true,
                multiple_selection: false,
                is_flagged: true,
                field_type: "BOOLEAN",
                ordinal: 2,
              },
            ],
          },
        ],
      },
    ],
    created_at: new Date("2023-01-15"),
  },
  {
    id: "template-2",
    title: "Quality Assurance Audit",
    description: "Ensure quality standards compliance across operations",
    photo: "/production-line-inspection.png",
    pages: [
      {
        id: "page-2",
        template_id: "template-2",
        title: "Process Verification",
        description: "Verify that processes meet quality standards",
        ordinal: 1,
        sections: [
          {
            id: "section-2",
            page_id: "page-2",
            title: "Documentation",
            ordinal: 1,
            questions: [
              {
                id: "question-3",
                page_id: "page-2",
                section_id: "section-2",
                text: "Are standard operating procedures up to date?",
                required: true,
                multiple_selection: false,
                is_flagged: false,
                field_type: "BOOLEAN",
                ordinal: 1,
              },
            ],
          },
        ],
      },
    ],
    created_at: new Date("2023-02-20"),
  },
  {
    id: "template-3",
    title: "Environmental Compliance Audit",
    description: "Assess compliance with environmental regulations and standards",
    photo: "/green-checklist-earth.png",
    pages: [
      {
        id: "page-3",
        template_id: "template-3",
        title: "Waste Management",
        description: "Assessment of waste handling procedures",
        ordinal: 1,
        sections: [
          {
            id: "section-3",
            page_id: "page-3",
            title: "Disposal Procedures",
            ordinal: 1,
            questions: [
              {
                id: "question-4",
                page_id: "page-3",
                section_id: "section-3",
                text: "Are hazardous materials properly labeled and stored?",
                required: true,
                multiple_selection: false,
                is_flagged: true,
                field_type: "BOOLEAN",
                ordinal: 1,
              },
            ],
          },
        ],
      },
    ],
    created_at: new Date("2023-03-10"),
  },
  {
    id: "template-4",
    title: "Financial Controls Audit",
    description: "Review of financial controls and compliance",
    photo: "/balancing-the-books.png",
    pages: [
      {
        id: "page-4",
        template_id: "template-4",
        title: "Internal Controls",
        description: "Assessment of internal financial controls",
        ordinal: 1,
        sections: [
          {
            id: "section-4",
            page_id: "page-4",
            title: "Authorization Procedures",
            ordinal: 1,
            questions: [
              {
                id: "question-5",
                page_id: "page-4",
                section_id: "section-4",
                text: "Are expenditures properly authorized?",
                required: true,
                multiple_selection: false,
                is_flagged: false,
                field_type: "BOOLEAN",
                ordinal: 1,
              },
            ],
          },
        ],
      },
    ],
    created_at: new Date("2023-04-05"),
  },
]
