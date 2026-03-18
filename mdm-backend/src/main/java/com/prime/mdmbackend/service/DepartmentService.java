package com.prime.mdmbackend.service;

import com.prime.mdmbackend.dto.DepartmentDTO;
import com.prime.mdmbackend.entity.Department;
import com.prime.mdmbackend.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<Department> getAll() {
        return departmentRepository.findAll();
    }

    public Department getById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found: " + id));
    }

    public Department create(DepartmentDTO dto) {
        departmentRepository.findByName(dto.getName()).ifPresent(d -> {
            throw new RuntimeException("Department already exists: " + dto.getName());
        });
        Department dept = new Department();
        dept.setName(dto.getName());
        dept.setDescription(dto.getDescription());
        return departmentRepository.save(dept);
    }

    public Department update(Long id, DepartmentDTO dto) {
        Department dept = getById(id);
        dept.setName(dto.getName());
        dept.setDescription(dto.getDescription());
        return departmentRepository.save(dept);
    }

    public void delete(Long id) {
        departmentRepository.deleteById(id);
    }
}