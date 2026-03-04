import { Route, Routes } from "react-router-dom";
import { Tickets } from "../app/tickets/tickets";
import {TicketDetails} from "../app/ticket-details/ticket-details";

const RoutesComponent = () => {
    return (
        <Routes>
            <Route path="/" element={<Tickets />} />
            <Route path="/ticket/:id" element={<TicketDetails />} />
        </Routes>
    );
};

export default RoutesComponent;