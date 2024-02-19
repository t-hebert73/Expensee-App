<template>
  <Card>
    <template #title>
      <div class="flex justify-content-between">
        <div class="text-2xl text-900">{{ title }}</div>
      </div>
    </template>
    <template #content>
      <section class="grid grid-nogutter">
        <div class="col-12">
          <template v-if="uploadResult.status">
            <Knob v-model="uploadResult.totalImported" :min="0" :max="uploadResult.total"></Knob>

            <p>
              Successfully imported {{ uploadResult.totalImported }} records of a possible {{ uploadResult.total }}.
            </p>
          </template>
          <template v-else>
            <FileUpload
              mode="basic"
              name="demo[]"
              url="htt"
              :maxFileSize="1000000"
              :auto="true"
              chooseLabel="Browse"
              accept=".csv"
              customUpload
              @uploader="upload"
            />
          </template>
        </div>
      </section>
    </template>
  </Card>
</template>

<script lang="ts">
import FileUpload from 'primevue/fileupload';
import Knob from 'primevue/knob';

import Card from 'primevue/card';
import { ref, defineComponent } from 'vue';
import { useMutation } from '@urql/vue';
import { ImportPaymentsDocument, MutationImportPaymentsArgs, ImportType } from '@/graphql/generated';

export default defineComponent({
  components: { Card, FileUpload, Knob },
  setup() {
    const title = ref('Upload CSV (RBC)');
    const uploadResult = ref({ status: '', total: 0, totalImported: 0 });

    const uploadExpensesMutation = useMutation(ImportPaymentsDocument);
    const upload = async (event: any) => {
      const file: File = event.files[0];

      const type: ImportType = ImportType.Rbc;

      const input: MutationImportPaymentsArgs = {
        file: file,
        type: type,
      };

      const result = await uploadExpensesMutation.executeMutation(input);

      if (result.data) {
        title.value = 'Import Successful';
        uploadResult.value = result.data?.importPayments;
      }
    };

    return { upload, uploadResult, title };
  },
});
</script>
