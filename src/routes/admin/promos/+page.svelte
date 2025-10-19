<script lang="ts">
    // Basic promos management page
    let promos = [
        { id: 1, name: 'Summer Sale', type: 'discount', value: 20, active: true },
        { id: 2, name: 'New Customer Coupon', type: 'coupon', code: 'WELCOME10', active: false }
    ];

    function togglePromo(id: number) {
        const promo = promos.find(p => p.id === id);
        if (promo) promo.active = !promo.active;
        promos = [...promos]; // Trigger reactivity
    }
</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Precios y Promociones</h1>

    <div class="mb-4">
        <button class="bg-blue-500 text-white px-4 py-2 rounded">Agregar Nueva Promo</button>
    </div>

    <div class="grid gap-4">
        {#each promos as promo}
            <div class="border p-4 rounded">
                <h3 class="font-semibold">{promo.name}</h3>
                <p>Tipo: {promo.type} - Valor: {promo.value || promo.code}</p>
                <label class="flex items-center">
                    <input type="checkbox" bind:checked={promo.active} on:change={() => togglePromo(promo.id)} />
                    Activo
                </label>
            </div>
        {/each}
    </div>
</div>
