<script lang="ts">
    // Basic RMA/Devoluciones management page
    let rmas = [
        { id: 1, orderId: 'ORD-001', reason: 'Producto defectuoso', status: 'pending', date: '2023-10-01' },
        { id: 2, orderId: 'ORD-002', reason: 'No me gusta', status: 'approved', date: '2023-10-02' }
    ];

    function updateStatus(id: number, newStatus: string) {
        const rma = rmas.find(r => r.id === id);
        if (rma) rma.status = newStatus;
        rmas = [...rmas];
    }
</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Devoluciones/RMA</h1>

    <div class="mb-4">
        <button class="bg-red-500 text-white px-4 py-2 rounded">Procesar Nueva Devolución</button>
    </div>

    <div class="grid gap-4">
        {#each rmas as rma}
            <div class="border p-4 rounded">
                <h3 class="font-semibold">Devolución #{rma.id} - Orden {rma.orderId}</h3>
                <p>Razón: {rma.reason} - Fecha: {rma.date}</p>
                <p>Estado: <span class="font-semibold">{rma.status}</span></p>
                <select bind:value={rma.status} on:change={() => updateStatus(rma.id, rma.status)}>
                    <option value="pending">Pendiente</option>
                    <option value="approved">Aprobada</option>
                    <option value="rejected">Rechazada</option>
                    <option value="completed">Completada</option>
                </select>
            </div>
        {/each}
    </div>
</div>
