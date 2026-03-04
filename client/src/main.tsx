import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";

import App from "./app/app";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
);
const queryClient = new QueryClient();

root.render(
    <QueryClientProvider client={queryClient}>
        <AgGridProvider modules={[AllCommunityModule]}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AgGridProvider>
    </QueryClientProvider>,
);
