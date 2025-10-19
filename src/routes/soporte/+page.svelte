<script lang="ts">
    // Basic customer support page
    let tickets = [
        { id: 1, subject: 'Problema con entrega', status: 'open', priority: 'high' },
        { id: 2, subject: 'Consulta sobre producto', status: 'closed', priority: 'low' }
    ];

    let newTicket = { subject: '', message: '' };

    function submitTicket() {
        if (newTicket.subject && newTicket.message) {
            tickets = [...tickets, { id: tickets.length + 1, subject: newTicket.subject, status: 'open', priority: 'medium' }];
            newTicket = { subject: '', message: '' };
        }
    }
</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Atención al Cliente</h1>

    <!-- Chat Widget -->
    <div class="mb-6 border p-4 rounded">
        <h2 class="font-semibold">Chat en Vivo</h2>
        <p>Inicia un chat con nuestro equipo de soporte.</p>
        <button class="bg-blue-500 text-white px-4 py-2 rounded mt-2">Iniciar Chat</button>
    </div>

    <!-- WhatsApp Contact -->
    <div class="mb-6 border p-4 rounded">
        <h2 class="font-semibold">Contacto por WhatsApp</h2>
        <p>Envíanos un mensaje directo: +1234567890</p>
        <a href="https://wa.me/1234567890" class="bg-green-500 text-white px-4 py-2 rounded">Abrir WhatsApp</a>
    </div>

    <!-- Tickets -->
    <div class="border p-4 rounded">
        <h2 class="font-semibold mb-4">Tickets de Soporte</h2>
        <div class="mb-4">
            <input bind:value={newTicket.subject} placeholder="Asunto" class="border p-2 w-full mb-2" />
            <textarea bind:value={newTicket.message} placeholder="Mensaje" class="border p-2 w-full mb-2"></textarea>
            <button on:click={submitTicket} class="bg-blue-500 text-white px-4 py-2 rounded">Enviar Ticket</button>
        </div>
        <div class="grid gap-2">
            {#each tickets as ticket}
                <div class="border p-2 rounded flex justify-between">
                    <span>{ticket.subject} - {ticket.status}</span>
                    <span class="text-sm text-gray-500">{ticket.priority}</span>
                </div>
            {/each}
        </div>
    </div>
</div>
