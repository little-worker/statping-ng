<template>
  <div class="incidents" v-if="hasIncidents()">
    <div
      v-for="(incident, i) in incidents"
      class="incident"
      :class="lastIncidentClass(incident, false)"
    >
      <h6>
        {{ incident.title }}
        <span class="badge" :class="lastIncidentClass(incident)">
          {{ lastIncidentName(incident) }}
        </span>
        <span class="font-2 float-right">
          {{ niceDate(incident.created_at) }}
        </span>
      </h6>
      <div
        class="font-2 mb-3"
        v-html="incident.description"
      />
      <IncidentUpdate
        v-for="(update, i) in incident.updates"
        :key="i"
        :update="update"
        :admin="false"
      />
    </div>
  </div>
</template>

<script>
import Api from '../../API';
import IncidentUpdate from '@/components/Elements/IncidentUpdate';

export default {
    name: 'IncidentsBlock',
    components: {
        IncidentUpdate
    },
    props: {
        service: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            incidents: null,
        };
    },
    mounted () {
        this.getIncidents();
    },
    methods: {
        hasIncidents () {
            return this.incidents && this.incidents.length > 0;
        },
        badgeClass (val, badge=true) {
            switch (val.toLowerCase()) {
                case 'résolu':
                    return `${badge ? 'badge-' : ''}success`;
                case 'mise à jour':
                    return `${badge ? 'badge-' : ''}info`;
                case 'en cours':
                    return `${badge ? 'badge-' : ''}danger`;
            }
        },
        lastIncidentClass (incident, badge=true) {
            if (!incident.updates) { return ''; }
            return this.badgeClass(incident.updates[incident.updates.length - 1].type, badge);
        },
        lastIncidentName (incident) {
            if (!incident.updates) { return 'Inconnu'; }
            return incident.updates[incident.updates.length - 1].type;
        },
        async getIncidents () {
            this.incidents = await Api.incidents_service(this.service.id);
        },
        async incident_updates (incident) {
            return await Api.incident_updates(incident);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
