import type { ElementType } from 'react'

import { BookOpen, FileText, Presentation, Shield } from 'lucide-react'

export type Resource = {
  category: string
  description: string
  href: string
  icon: ElementType
  title: string
}

export const RESOURCES: Resource[] = [
  {
    category: 'Interactive',
    description: 'A visual, step-by-step walkthrough of how SIV works — from ballot creation through verification.',
    href: '/protocol',
    icon: BookOpen,
    title: 'Illustrated Protocol — High Level',
  },
  {
    category: 'Specification',
    description:
      'The complete technical specification defining what constitutes a SIV election, covering cryptographic primitives, data structures, and verification procedures.',
    href: 'https://docs.siv.org/technical-specifications',
    icon: FileText,
    title: 'Technical Specification',
  },
  {
    category: 'Research',
    description:
      'Peer-reviewed poster presented at E-Vote-ID, detailing the formal security properties of the SIV protocol.',
    href: '/evoteid-poster',
    icon: Shield,
    title: 'EVoteID Poster — Security Properties',
  },
  {
    category: 'Reference',
    description:
      'Answers to common questions about digital voting, security, privacy, and how SIV compares to traditional methods.',
    href: '/faq',
    icon: Presentation,
    title: 'Frequently Asked Questions',
  },
  {
    category: 'Research',
    description:
      'The cryptographic building blocks that make authenticated, private, and verifiable digital voting possible.',
    href: '/about#research',
    icon: BookOpen,
    title: 'Academic Research Papers',
  },
]
