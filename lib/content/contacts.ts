import type { ContactRecord, SocialLink } from './types'

export const socialLinks = [
  {
    id: 'facebook',
    label: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=659344013',
    verification: 'source-confirmed',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/whatsupdanny/',
    verification: 'source-confirmed',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/daniel-franzese-84126a57/',
    verification: 'source-confirmed',
  },
  {
    id: 'twitter',
    label: 'Twitter',
    url: 'https://www.twitter.com/WhatsupDanny',
    verification: 'source-confirmed',
  },
  {
    id: 'imdb',
    label: 'IMDb',
    url: 'https://www.imdb.com/name/nm0291881/',
    verification: 'source-confirmed',
  },
] as const satisfies readonly SocialLink[]

export const contacts = [
  {
    id: 'advanced-management-booking',
    name: 'Gary Ousdahl',
    email: {
      visible: 'Gary@AdvancedManagement.tv',
      destination: 'mailto:Gary@AdvancedManagement.tv',
    },
    phones: [
      {
        label: 'Mobile',
        visible: '(424) 333-1500',
        destination: 'tel:+14243331500',
      },
    ],
    inquiryCategories: [
      'Theatrical & Public Appearances',
      'College & Speaking Engagements',
      'Press & Invites',
    ],
    verification: 'source-confirmed',
    socialLinks,
  },
] as const satisfies readonly ContactRecord[]

export const contactById = (id: string): ContactRecord | undefined =>
  contacts.find((contact) => contact.id === id)
