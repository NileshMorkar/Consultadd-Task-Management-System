package com.taskManagement.project.controller;

import com.taskManagement.project.dto.TagDto;
import com.taskManagement.project.model.Tag;
import com.taskManagement.project.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TagController {

    private final TagService tagService;

    @GetMapping
    public ResponseEntity<List<TagDto>> listTags() {
        return ResponseEntity.ok(tagService.getAllTags()
                .stream().map(t -> new TagDto(t.getId(), t.getName())).collect(Collectors.toList()));
    }

    @PostMapping
    public ResponseEntity<TagDto> create(@RequestBody TagDto dto) {
        Tag tag = tagService.create(Tag.builder().name(dto.getName()).build());
        return ResponseEntity.ok(new TagDto(tag.getId(), tag.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TagDto> update(@PathVariable Long id, @RequestBody TagDto dto) {
        Tag tag = tagService.update(id, dto.getName());
        return ResponseEntity.ok(new TagDto(tag.getId(), tag.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        tagService.delete(id);
        return ResponseEntity.ok().build();
    }
}

