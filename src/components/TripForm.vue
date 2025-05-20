    async submitTrip() {
      try {
        // Obtenha o driver_id consistente do método centralizado
        const driverId = await this.$api.getDriverId();
        console.log('Usando driver_id consistente para nova viagem:', driverId);
        
        // Obtenha o ID do usuário do localStorage ou de onde estiver armazenado
        const userId = localStorage.getItem('user_id') || driverId;
        
        // Atualiza os IDs no objeto de viagem como strings
        this.trip.user_id = String(userId);
        this.trip.driver_id = String(driverId); // Usa o driver_id consistente
        
        // Garantir que valores numéricos sejam tratados corretamente
        if (typeof this.trip.distance === 'string') {
          this.trip.distance = parseFloat(this.trip.distance.replace(',', '.'));
        }
        
        if (typeof this.trip.earnings === 'string') {
          this.trip.earnings = parseFloat(this.trip.earnings.replace(',', '.'));
        }
        
        console.log('Dados da viagem antes de enviar:', this.trip);
        
        await this.$api.createTrip(this.trip)

