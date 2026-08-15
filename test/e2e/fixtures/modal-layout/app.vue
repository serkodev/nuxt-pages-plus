<template>
  <div>
    <PlusModalApp />

    <PlusModalApp v-slot="{ route, layout }" :route="$route">
      <output id="modal-app-slot-route" hidden>
        {{ route?.fullPath }}
      </output>
      <output id="modal-app-slot-layout" hidden>
        {{ layout }}
      </output>
    </PlusModalApp>
  </div>
</template>
