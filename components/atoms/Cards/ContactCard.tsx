import { FC } from 'react'

type ContactCardProps = {
  handles: string
  name: string
  email: string
  phoneNumbers: string[]
}

const ContactCard: FC<ContactCardProps> = ({
  handles,
  name,
  email,
  phoneNumbers,
}) => {
  const splitEmail = email.split('@')
  return (
    <div>
      <ul>
        <li className="font-extrabold text-xl">{handles}</li>
        <li className="">{name}</li>
        <li>
          <strong>{splitEmail[0]}</strong>@{splitEmail[1]}
        </li>
        {phoneNumbers.map((phoneNumber) => {
          const splitNumber = phoneNumber.split(':')
          return (
            <li key={phoneNumber}>
              {splitNumber[0]}:<strong>{splitNumber[1]}</strong>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ContactCard
