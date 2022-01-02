import ContactCard from '@/components/atoms/Cards/ContactCard'
import Stripes from '@/components/atoms/Icons/Stripes'

const contacts = [
  {
    handles: 'Theatrical & Public Appearances',
    name: 'Gary Ousdahl',
    email: 'Gary@AdvancedManagement.tv',
    phoneNumbers: ['Mobile: (424)333-1500'],
  },
  {
    handles: 'College & Speaking Engagements',
    name: 'Barb Holliday',
    email: 'BHolliday@FlappersComedy.com',
    phoneNumbers: ['Mobile: (818)679-2272', 'Office: (818)845-9721'],
  },
  {
    handles: 'Press & Invites',
    name: 'Nick Ponisi',
    email: 'Nick@PressHerePublicity.com',
    phoneNumbers: ['Office: (323)556-9752'],
  },
]

const BookMeNow = () => {
  return (
    <div id="contact" className="text-center text-3xl">
      <h2 className="p-3">Book Me Now</h2>
      <Stripes />
      <div className="flex flex-row justify-evenly mx-auto text-xl ">
        {/* 'grid grid-cols-3 p-2 text-lg' */}
        {contacts.map((contact) => {
          return <ContactCard key={contact.handles} {...contact} />
        })}
      </div>
    </div>
  )
}

export default BookMeNow
