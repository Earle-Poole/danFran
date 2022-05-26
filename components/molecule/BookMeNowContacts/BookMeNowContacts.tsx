import ContactCard from '@/components/atoms/Cards/ContactCard'
import Stripes from '@/components/atoms/Icons/Stripes'

const contacts = [
  {
    handles: 
    ["Theatrical & Public Appearances", 
    "College & Speaking Engagements",
    "Press & Invites"],
    name: 'Gary Ousdahl',
    email: 'Gary@AdvancedManagement.tv',
    phoneNumbers: ['Mobile: (424) 333-1500'],
  },
]

const BookMeNow = () => {
  return (
    <div className="text-center text-3xl">
      <h2 className="p-3">Book Me Now</h2>
      <Stripes />
      <div className="flex flex-col md:flex-row md:flex-wrap md:gap-10 justify-evenly mx-auto text-xl">
        {contacts.map((contact) => {
          return <ContactCard key={contact.name} {...contact} />
        })}
      </div>
    </div>
  )
}

export default BookMeNow
