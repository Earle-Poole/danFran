type NavItemProps = {name: string}

const NavItem = (props: NavItemProps) => {
return (
    <div className="text-2xl font-light p-3 self-center">
        {props.name}
    </div>
)
} 

export default NavItem;
