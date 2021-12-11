type NavItemProps = {name: string}

const NavItem = (props: NavItemProps) => {
return (
    <div className="text-2xl font-light p-3 self-center hover:text-pink-700 transition duration-150 hover:underline">
        {props.name}
    </div>
)
} 

export default NavItem;
