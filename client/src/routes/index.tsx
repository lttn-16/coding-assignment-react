import { Route, Routes } from "react-router-dom";
import { Tickets } from "../app/tickets/tickets";

const RoutesComponent = () => {
    return (
        <Routes>
            <Route path="/" element={<Tickets />} />
            {/* Hint: Try `npx nx g component TicketDetails --project=client --no-export` to generate this component  */}
            {/* <Route path="/:id" element={<TicketDetails tickets={tickets} users={users} />} /> */}
        </Routes>
    );
};

export default RoutesComponent;