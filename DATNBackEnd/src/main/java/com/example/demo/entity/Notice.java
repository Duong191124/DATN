package com.example.demo.entity;
import com.pusher.rest.Pusher;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "notice")
public class Notice extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false)
    private String content;

    @Column(length = 255)
    private String link;

    private int status;

    public void sendNotice() {
        Pusher pusher = new Pusher("1890867", "23b12a546fae0e5577bc", "03b359d8edd4ae66651b");
        pusher.setCluster("ap1");
        pusher.setEncrypted(true);

        Map<String, String> data = new HashMap<>();
        data.put("message", this.title);
        data.put("content", this.content);

        pusher.trigger("my-channel", "my-event", data);
    }

}
