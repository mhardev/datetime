$(document).ready(function () {
    const timeSlots = $('.time-slot');
    const selectedSlot = $('#selected-slot');
    const saveButton = $('#saveApp');
    const bookedSlotsContainer = $('#booked-slot');
    let slotData = {}; // Store the initial slot data
    let bookedAppointments = [];

    // Function to reset the slots based on the initial data
    function resetSlots() {
        Object.keys(slotData).forEach(key => {
            const slot = slotData[key];
            const element = timeSlots.filter(`[data-time="${slot.time}"]`);
            element.text(`${slot.time} (${slot.available}/${slot.total})`);
            element.removeClass('full');
            element.addClass('available');
        });
    }

    // Function to update the booked slots display
    function updateBookedSlots() {
        bookedSlotsContainer.html(bookedAppointments.join('<br>'));
    }

    // Function to save the selected slot as a booked appointment
    function saveAppointment(date, time) {
        const currentDate = new Date();
        
        // Convert to Philippine time (UTC+8)
        currentDate.setUTCHours(currentDate.getUTCHours() + 8);
    
        const formattedDate = currentDate.toISOString().split('T')[0];
        const currentTime = currentDate.toISOString().split('T')[1].substring(0, 5);
    
        const appointment = `Booked Slot: ${date} ${time} created at: ${formattedDate} ${currentTime}`;
        bookedAppointments.unshift(appointment); // Add to the beginning of the array
        updateBookedSlots();
    }

    // Initialize Datepicker with options
    $('#datepicker').datepicker({
        minDate: 0,  // Disable past dates
        dateFormat: "yy-mm-dd",  // Set the date format
        onSelect: function (dateText) {
            // When a date is selected, you can access it here
            const selectedDate = dateText;
            selectedSlot.text("No slot selected"); // Clear selected slot
            resetSlots(); // Reset slots on a new date selection

            // Store the initial slot data
            slotData = {};
            timeSlots.each(function () {
                const slot = $(this);
                const slotsInfo = slot.text().match(/(\d+)\/(\d+)/);
                const availableSlots = parseInt(slotsInfo[1]);
                const totalSlots = parseInt(slotsInfo[2]);
                slotData[slot.data('time')] = {
                    time: slot.data('time'),
                    available: availableSlots,
                    total: totalSlots,
                };
            });

            // Handle time slot selection when a date is chosen
            timeSlots.click(function () {
                const selectedTime = $(this).data('time');
                if (!$(this).hasClass('full')) {
                    if ($(this).hasClass('selected')) {
                        // Handle unselecting a slot
                        selectedSlot.text(`No slot selected`);
                        $(this).removeClass('selected');
                    } else {
                        // Handle selecting a slot
                        selectedSlot.text(`Selected Time Slot: ${selectedDate} ${selectedTime}`);
                        $(this).addClass('selected');
                    }
                }
            });

            // Handle Save Appointment button click
            saveButton.click(function () {
                const selectedTime = $('.time-slot.selected').data('time');
                if (selectedTime) {
                    // Save the appointment and update the display
                    saveAppointment(selectedDate, selectedTime);

                    // Deduct the available slot count
                    const selectedSlotData = slotData[selectedTime];
                    selectedSlotData.available -= 1;
                    $(`.time-slot[data-time="${selectedTime}"]`).text(`${selectedTime} (${selectedSlotData.available}/${selectedSlotData.total})`);

                    // Check if there are no more available slots
                    if (selectedSlotData.available === 0) {
                        $(`.time-slot[data-time="${selectedTime}"]`).addClass('full').removeClass('available');
                    }

                    // Clear selected slot
                    selectedSlot.text("No slot selected");
                    $('.time-slot.selected').removeClass('selected');
                } else {
                    alert("Please select a time slot before saving.");
                }
            });
        }
    });
});