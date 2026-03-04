import { useParams } from "react-router-dom";
import styles from "./ticket-details.module.css";
import { Ticket } from "@acme/shared-models";
import { useEffect, useState } from "react";
import { Card, Select } from "antd";

export function TicketDetails() {
    const { id } = useParams<{ id: string }>();
    const [ticket, setTicket] = useState<Ticket | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchTicket = async () => {
            try {
                const response = await fetch(`/api/tickets/${id}`);
                const data = await response.json();
                setTicket(data);
            } catch (error) {
                console.error("Failed to fetch ticket details:", error);
            }
        };
        fetchTicket();
    }, [id]);

    const handleChange = (value: string) => {

    }

    return (
        <div className={styles["container"]}>
            <h2>TicketDetails!</h2>
            {ticket ? (
                <>
                    <Card
                        title={`TICKET ID: ${ticket?.id}`}
                        className={styles["darkCard"]}
                    >
                        <p>
                            <b>Description:</b>{" "}
                            {`${ticket?.description ? ticket.description : ""}`}
                        </p>
                        <p>
                            <b>Assignee:</b>{" "}
                            {`${
                                ticket?.assigneeId
                                    ? ticket?.assigneeId
                                    : "Unassigned"
                            }`}
                        </p>
                        <p>
                            <b>Status:</b>{" "}
                            {`${ticket?.completed ? "Complete" : "Incomplete"}`}
                        </p>
                    </Card>
                    <h3>Assigned To:</h3>
                    <div>
                        <Select
                            defaultValue="lucy"
                            style={{ width: 400 }}
                            onChange={handleChange}
                            options={[
                                { value: "jack", label: "Jack" },
                                { value: "lucy", label: "Lucy" },
                                { value: "Yiminghe", label: "yiminghe" },
                            ]}
                        />
                    </div>
                </>
            ) : null}
        </div>
    );
}

export default TicketDetails;
