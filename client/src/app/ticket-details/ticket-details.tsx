import { useParams } from "react-router-dom";
import styles from "./ticket-details.module.css";
import { Ticket, User } from "@acme/shared-models";
import { useEffect, useMemo, useState } from "react";
import { Card, Select } from "antd";
import { useUsers } from "client/src/hooks/useUsers";

export function TicketDetails() {
    const { id } = useParams<{ id: string }>();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const { data: users } = useUsers();

    const assigneeOptions = useMemo(() => {
        return users?.map((user: User) => ({
            value: user.id,
            label: user.name,
        }));
    }, [users]);

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

    const handleChange = async (value: number) => {
        try {
            await fetch(`/api/tickets/${id}/assign/${value}`, {
                method: "PUT",
            });
            setTicket((prev) => prev && { ...prev, assigneeId: value });
        } catch (error) {
            setTicket((prev) => prev && { ...prev, assigneeId: value });
        }
    };

    const getAssigneeName = (assigneeId: number | null) => {
        const assignee = users?.find((user: User) => user.id === assigneeId);
        return assignee ? assignee.name : "Unassigned";
    };

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
                                    ? getAssigneeName(ticket.assigneeId)
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
                            style={{ width: 400 }}
                            onChange={handleChange}
                            options={assigneeOptions}
                            value={ticket.assigneeId ?? undefined}
                        />
                    </div>
                </>
            ) : null}
        </div>
    );
}

export default TicketDetails;
