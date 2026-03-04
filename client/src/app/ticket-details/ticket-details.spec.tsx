import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TicketDetails from "./ticket-details";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({ id: "1" }),
}));

jest.mock("client/src/hooks/useUsers", () => ({
    useUsers: () => ({
        data: [
            { id: 1, name: "Jenny" },
            { id: 2, name: "Lucas" },
        ],
    }),
}));

describe("TicketDetails", () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        id: 1,
                        description: "Test ticket",
                        assigneeId: 1,
                        completed: false,
                    }),
            }),
        ) as jest.Mock;
    });

    it("should render successfully", async () => {
        render(
            <BrowserRouter>
                <TicketDetails />
            </BrowserRouter>,
        );

        await waitFor(() => {
            expect(screen.getByText("TICKET ID: 1")).toBeInTheDocument();
        });
    });
});
