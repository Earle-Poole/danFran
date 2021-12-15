import { FC } from "react";

type ContactCardProps = {
  handles: string;
  name: string;
  email: string;
  phoneNumbers: string[];
};

const ContactCard: FC<ContactCardProps> = ({
  handles,
  name,
  email,
  phoneNumbers,
}) => {
  return (
    <div>
      <ul>
        <li>{handles}</li>
        <li>{name}</li>
        <li>{email}</li>
        {phoneNumbers.map((phoneNumber) => {
          return <li key={phoneNumber}>{phoneNumber}</li>;
        })}
      </ul>
    </div>
  );
};

export default ContactCard;
