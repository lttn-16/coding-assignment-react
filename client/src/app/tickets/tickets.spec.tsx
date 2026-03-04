import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Tickets from "./tickets";
import { MemoryRouter } from "react-router-dom";
import { AgGridProvider } from "ag-grid-react";
import { AllCommunityModule } from "ag-grid-community";

const renderWithClient = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <AgGridProvider modules={[AllCommunityModule]}>
                <MemoryRouter>
                    <Tickets />
                </MemoryRouter>
            </AgGridProvider>
        </QueryClientProvider>,
    );
};

describe("Tickets", () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve([]),
            }),
        ) as jest.Mock;
    });

    it("should render title", () => {
        renderWithClient();
        expect(screen.getByText("Ticket List")).toBeInTheDocument();
    });

    it("should render new ticket button", () => {
        renderWithClient();
        expect(
            screen.getByRole("button", { name: "New Ticket" }),
        ).toBeInTheDocument();
    });
});
