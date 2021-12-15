import ContactCard from "@/components/atoms/Cards/ContactCard";

const BookMeNow = () => {
  const contacts = [
    {
      handles: "Theatrical & Public Appearances",
      name: "Gary Ousdahl",
      email: "Gary@AdvancedManagement.tv",
      phoneNumbers: ["Mobile: (424)333-1500"],
    },
    {
      handles: "College & Speaking Engagements",
      name: "Barb Holliday",
      email: "BHolliday@FlappersComedy.com",
      phoneNumbers: ["Mobile: (818)679-2272", "Office: (818)845-9721"],
    },
    {
      handles: "Press & Invites",
      name: "Nick Ponisi",
      email: "Nick@PressHerePublicity.com",
      phoneNumbers: ["Office: (323)556-9752"],
    },
  ];

  return (
    <div>
      <h2>Book Me Now</h2>
      <div>
        {contacts.map((contact) => {
          return (
            <ContactCard
              key={contact.handles}
              handles={contact.handles}
              name={contact.name}
              email={contact.email}
              phoneNumbers={contact.phoneNumbers}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BookMeNow;
