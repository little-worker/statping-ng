<template>
    <div v-if="services.length > 0">
        <h4 v-if="group.name !== 'Empty Group'" class="group_header mb-3 mt-4">{{group.name}}</h4>
        <div class="list-group online_list mb-4">

          <div v-for="service in services" :ref="service.id" v-bind:key="service.id">
            <ServiceBlock :service="service" />
          </div>

        </div>
    </div>
</template>

<script>
    const GroupServiceFailures = () => import(/* webpackChunkName: "index" */ './GroupServiceFailures');
    const IncidentsBlock = () => import(/* webpackChunkName: "index" */ './IncidentsBlock');
    const ServiceBlock = () => import(/* webpackChunkName: "index" */ '@/components/Service/ServiceBlock')

export default {
  name: 'Group',
  components: {
      IncidentsBlock,
      GroupServiceFailures,
      ServiceBlock
  },
  props: {
    group: {
      type: Object,
      required: true,
    }
  },
  computed: {
    services() {
      return this.$store.getters.servicesInGroup(this.group.id)
    }
  }
}
</script>
