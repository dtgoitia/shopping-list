import Paths from "../routes";
import { Button } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface NavBarButtonProps {
  text: string;
  path: string;
}
function NavBarButton({ text, path }: NavBarButtonProps) {
  return (
    <Link to={path}>
      <Button text={`Go to "${text}"`} />
    </Link>
  );
}

const Container = styled.div`
  margin-bottom: 1rem;
`;

function NavBar() {
  return (
    <Container>
      <NavBarButton text="Shopping list" path={Paths.root} />
      <NavBarButton text="Inventory" path={Paths.items} />
    </Container>
  );
}

export default NavBar;
