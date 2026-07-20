import { useEffect, useState } from "react";

import ClientForm from "../../features/clients/components/ClientForm/ClientForm";
import {
  createClient,
  deleteClient,
  getClients,
  updateClient,
} from "../../features/clients/api/clientApi";
import type { Client } from "../../features/clients/types";
import type { ClientFormValues } from "../../features/clients/schemas/clientSchema";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const response = await getClients();

      setClients(response.data);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(values: ClientFormValues) {
    try {
      setSaving(true);

      if (selectedClient) {
        await updateClient(selectedClient.id, values);
      } else {
        await createClient(values);
      }

      await loadClients();

      setSelectedClient(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteClient(id);

    if (selectedClient?.id === id) {
      setSelectedClient(null);
    }

    await loadClients();
  }

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <h1>Clients</h1>

      <ClientForm
        initialData={selectedClient ?? undefined}
        isSubmitting={saving}
        onSubmit={handleSubmit}
      />

      <hr />

      {clients?.map((client) => (
        <div key={client.id}>
          <h3>{client.name}</h3>

          <p>{client.organisation}</p>

          <button onClick={() => setSelectedClient(client)}>Edit</button>

          <button onClick={() => handleDelete(client.id)}>Delete</button>
        </div>
      ))}
    </>
  );
}
