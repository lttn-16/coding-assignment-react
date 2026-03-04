import { Route, Routes } from "react-router-dom";
import { Tickets } from "../app/tickets/tickets";
import {TicketDetails} from "../app/ticket-details/ticket-details";

const RoutesComponent = () => {
    return (
        <Routes>
            <Route path="/" element={<Tickets />} />
            {/* Hint: Try `npx nx g component TicketDetails --project=client --no-export` to generate this component  */}
            <Route path="/ticket/:id" element={<TicketDetails />} />
        </Routes>
    );
};

export default RoutesComponent;