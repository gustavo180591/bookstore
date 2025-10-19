<script lang="ts">
    // Basic notifications management page
    let notifications = [
        { id: 1, type: 'email', event: 'order_confirmation', template: 'Gracias por tu compra...', active: true },
        { id: 2, type: 'sms', event: 'shipping_update', template: 'Tu pedido ha sido enviado.', active: false }
    ];

    function toggleNotification(id: number) {
        const notif = notifications.find(n => n.id === id);
        if (notif) notif.active = !notif.active;
        notifications = [...notifications];
    }
</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Notificaciones</h1>

    <div class="mb-4">
        <button class="bg-purple-500 text-white px-4 py-2 rounded">Configurar Nueva Notificación</button>
    </div>

    <div class="grid gap-4">
        {#each notifications as notif}
            <div class="border p-4 rounded">
                <h3 class="font-semibold">{notif.type.toUpperCase()} - {notif.event}</h3>
                <p>Plantilla: {notif.template}</p>
                <label class="flex items-center">
                    <input type="checkbox" bind:checked={notif.active} on:change={() => toggleNotification(notif.id)} />
                    Activo
                </label>
            </div>
        {/each}
    </div>
</div>
